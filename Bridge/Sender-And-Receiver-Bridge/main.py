import json
import requests
import serial
import serial.tools.list_ports
import configparser
import paho.mqtt.client as mqtt


class Bridge:

    def __init__(self):
        self.feed = None
        self.baudRate = None
        self.clientMQTT = None
        self.inBuffer = None
        self.serial = None
        self.portName = None
        self.config = configparser.ConfigParser()
        if not self.config.read('config.ini'):
            print("Please write a config.ini file")
            exit(1)
        self.HPMS_server = None
        self.HPMS_port = None
        self.HPMS_username = None
        self.HPMS_station = None
        self.HPMS_animals = dict
        self.setupHPMS()
        self.setupSerial()
        self.setupMQTT()

    def setupHPMS(self):
        """
        Setup HPMS variable and MQTT Subscriptions
        """
        self.HPMS_server = self.config.get("HPMS", "server")
        self.HPMS_port = self.config.get("HPMS", "port")
        self.HPMS_username = self.config.get("HPMS", "username")
        self.HPMS_station = self.config.get("HPMS", "station")

        # Create a dictionary of animals, where the key is the animal id and the item is a json object list of animal meals
        animals = requests.get(f'http://{self.HPMS_server}:{self.HPMS_port}/api/users/'
                               f'{self.HPMS_username}/stations/{self.HPMS_station}/animals').json()

        self.HPMS_animals = {animal['id']: requests.get(f'http://{self.HPMS_server}:{self.HPMS_port}/api/users/{self.HPMS_username}/stations/{self.HPMS_station}/animals/{animal["id"]}/meals').json() for animal in animals}

    def setupSerial(self):
        """
        Open serial port to communicate with Arduino
        """

        # If UseDescription is 'yes' the port is searched by PortDescription string, otherwise it will use PortName
        # value
        if self.config.get("Serial", "UseDescription", fallback=False):
            print("List of available ports: ")
            ports = serial.tools.list_ports.comports()

            for port in ports:
                print(port.device)
                print(port.description)
                if self.config.get("Serial", "PortDescription", fallback="arduino").lower() in port.description.lower():
                    self.portName = port.device
        else:
            self.portName = self.config.get("Serial", "PortName", fallback="COM1")

        self.baudRate = self.config.get("Serial", "BaudRate", fallback=9600)

        try:
            if self.portName is not None:
                print(f"Connecting to {self.portName}")
                self.serial = serial.Serial(self.portName, self.baudRate, timeout=0)

        except serial.SerialException:
            self.serial = None

        # Internal input buffer from serial communication
        self.inBuffer = []

    def setupMQTT(self):
        """
        Open a connection with the MQTT Broker
        """

        self.clientMQTT = mqtt.Client()
        self.clientMQTT.on_connect = self.on_connect
        self.clientMQTT.on_message = self.on_message

        # check if broker need username and password
        if self.config.get("MQTT", "UseCredentials", fallback=False):
            username = self.config.get("MQTT", "Username")
            password = self.config.get("MQTT", "Password")
            self.clientMQTT.username_pw_set(username, password)

        self.feed = self.config.get("MQTT", "Feed")

        print("Connecting to MQTT Broker")
        self.clientMQTT.connect(
            self.config.get("MQTT", "Server", fallback="localhost"),
            self.config.getint("MQTT", "Port", fallback=1883),
            60)

        self.clientMQTT.loop_start()

    def on_connect(self, client, userdata, flags, rc):
        """
        Refactoring of the on_connection method of mqtt.Client
        :param client:
        :param userdata:
        :param flags:
        :param rc: Result Code
        :return:
        """

        print(f"Connected with result code {rc}")

        # Connect with MQTT topic of animals meals
        for animal_id in self.HPMS_animals.keys():
            self.clientMQTT.subscribe(f"{self.feed}/users/{self.HPMS_username}/stations/{self.HPMS_station}/animals/{animal_id}/meals")

    def on_message(self, client, userdata, msg):
        """
        The callback method for when a PUBLISHED message is received from the server
        :param client:
        :param userdata:
        :param msg: message
        :return:
        """

        print(f"{msg.topic}: {msg.payload}")

        feed_type = msg.topic.split('/')[-1]
        raw_params = msg.topic.split('/')[1:-1]
        params = {raw_params[i - 1]: raw_params[i] for i in range(1, len(raw_params), 2)}

        # If there is a new configuration of meals
        if feed_type == 'meals':
            self.HPMS_animals[int(params['animals'])] = json.loads(msg.payload.decode())

        print(f'[Animal {params["animals"]}] meals: {self.HPMS_animals[int(params["animals"])]}')

    def loop(self):
        """
        Infinite loop for managing serial communication
        """

        while True:
            # Look for a byte from serial
            if self.serial is not None:
                if self.serial.in_waiting > 0:
                    # Data available from the serial port
                    last_char = self.serial.read(1)

                    if last_char == b'\xfe':  # EOL
                        self.inBuffer.append(last_char)
                        print("\nValue received")
                        self.useData()
                        self.inBuffer = []
                    else:
                        # Append
                        self.inBuffer.append(last_char)

    def useData(self):
        """
        Elaborate received data and sent the value to MQTT Broker as feed
        :return: False if the received data is corrupted
        """

        if len(self.inBuffer) < 5:  # at least header, size, data, checksum, footer
            return False
        # split parts
        if self.inBuffer[0] != b'\xff':
            return False

        numval = int.from_bytes(self.inBuffer[1], byteorder='little')

        # calculate checksum and getting values
        checksum = numval
        val = list()
        for i in range(numval):
            val.append(int.from_bytes(self.inBuffer[i + 2], byteorder='little'))
            checksum = checksum ^ val[-1]

        checksum_received = int.from_bytes(self.inBuffer[-2], byteorder='little')
        print(f"Checksum received: {checksum_received}")
        print(f"Checksum calculated: {checksum}")

        # check if checksum is correct
        if checksum != checksum_received:
            return False

        for i in range(numval):
            print(f"Sensor {i}: {val[i]}")
            self.clientMQTT.publish(f'{self.feed}/{i}', f'{val[i]}')


if __name__ == '__main__':
    br = Bridge()
    br.loop()