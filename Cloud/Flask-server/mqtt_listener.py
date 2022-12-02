import configparser
import paho.mqtt.client as mqtt


class MQTTListener:
    def __init__(self, on_message_action_function):
        self.feed = None
        self.clientMQTT = None
        self.inBuffer = None
        self.config = configparser.ConfigParser()
        if not self.config.read('config.ini'):
            print("Please write a config.ini file")
            exit(1)
        self.setupMQTT()
        self.on_message_action = on_message_action_function

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

        print("[MQTT] Connecting to MQTT broker")
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

        print(f"[MQTT] Connected with result code {rc}")

        # Subscribing in on_connect() means that if we lose the connection and
        # reconnect then subscriptions will be renewed.
        self.clientMQTT.subscribe(f"{self.feed}")

    def on_message(self, client, userdata, msg):
        """
        The callback method for when a PUBLISH message is received from the server
        :param client:
        :param userdata:
        :param msg: message
        :return:
        """
        print(f"[MQTT] topic:{msg.topic} payload:{msg.payload}")

        feed_type = msg.topic.split('/')[-1]
        raw_params = msg.topic.split('/')[1:-1]
        params = {raw_params[i-1]: raw_params[i] for i in range(1, len(raw_params), 2)}

        self.on_message_action(feed_type, params, msg.payload)

    def loop(self):
        """
        Infinite loop for managing communication
        """

        while True:
            pass


if __name__ == '__main__':
    listener = MQTTListener(lambda a,b,c: print(f"Received: {a}, {b}, {c}"))
    listener.loop()
