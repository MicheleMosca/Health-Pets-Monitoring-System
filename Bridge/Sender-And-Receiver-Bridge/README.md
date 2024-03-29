# Sender And Receiver Bridge
Read a packet from Arduino and send station's sensors data values and animal's sensors data value to Flask server over MQTT topics.
Listening MQTT topics for new animal meals configuration and send packet with value of animal_id, meal_type and quantity as meal input to Arduino. 

## Data Packet Structure Received
An example of a data packet received from serial below:

| START | LEN | FOOD_LEVEL | WATER_LEVEL | ANIMAL_ID | ANIMAL_BEAT | ANIMAL_WEIGHT | ANIMAL_BARK | ANIMAL_TEMPERATURE | DISTANCE | CHECKSUM | END |
|:-----:|:---:|:----------:|:-----------:|:---------:|:-----------:|:-------------:|:-----------:|:------------------:|:--------:|:---------:|:---:|
|  xFF  |  7  |     h      |      m      |     1     |     20      |       2       |      1      |         36         |    1     |   48     | xFE |

Checksum is calculated from xor of length and data value. An example here:

```c
CHECKSUM = LEN ^ DATA_1 ^ DATA_2 = 2 ^ 20 ^ 40 = 62
```

## Data Packet Structure Sent
An example of a data packet sent to serial below:

| START | LEN | ANIMAL_ID | MEAL_TYPE | QUANTITY | CHECKSUM | END |
|:-----:|:---:|:---------:|:---------:|:--------:|:--------:|:---:|
|  xFF  |  3  |     1     |     s     |    2     |   112    | xFE |

Checksum is calculated from xor of length and data value. An example here:

```c
CHECKSUM = LEN ^ DATA = 1 ^ ord('A') = 1 ^ 65 = 64
```

## Setup
Install python requirements packages:
```shell
pip install -r requirements.txt
```

## Config File
Need to write a config.ini file to run the bridge. An example below:
```ini
[Serial]
UseDescription =
PortDescription =
PortName = /dev/rfcomm0
BaudRate = 9600

[MQTT]
Port = 1883
Server = broker.hivemq.com
UseCredentials =
Username =
Password =
Feed = HPMS

[HPMS]
server = localhost
port = 9000
username = michele
password = password
station = 1
```

## MQTT Topics
### Receive
- Receive Animals meals:
    ```text
    HPMS/users/{username}/stations/{station_id}/animals/{animal_id}/meals
    ```
### Send
- Send Animals beats:
    ```text
    HPMS/users/{username}/stations/{station_id}/animals/{animal_id}/beats
    ```
- Send Animals weights:
    ```text
    HPMS/users/{username}/stations/{station_id}/animals/{animal_id}/weights
    ```
- Send Station water level:
    ```text
    HPMS/users/{username}/stations/{station_id}/waters
    ```
- Send Station food level:
    ```text
    HPMS/users/{username}/stations/{station_id}/foods
    ```
- Send Animals barks:
    ```text
    HPMS/users/{username}/stations/{station_id}/animals/{animal_id}/barks
    ```
- Send Animals temperatures:
    ```text
    HPMS/users/{username}/stations/{station_id}/animals/{animal_id}/temperatures
    ```
