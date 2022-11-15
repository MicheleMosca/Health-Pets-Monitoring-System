# Sender And Receiver Bridge
Read a packet from serial and send data values to MQTT server.
Listening to MQTT server for new topic's message and send packet with value to serial. 

## Data Packet Structure Received Packet
An example of a data packet received from serial below:

| START | LEN | DATA_1 | DATA_2 | CHECKSUM | END |
|:-----:|:---:|:------:|:------:|:--------:|:---:|
|  xFF  |  2  |   20   |   40   |    62    | xFE |

Checksum is calculated from xor of length and data value. In this case is:

```c
CHECKSUM = LEN ^ DATA_1 ^ DATA_2 = 2 ^ 20 ^ 40 = 62
```

## Data Packet Structure Sent Packet
An example of a data packet sent to serial below:

| START | LEN | DATA | CHECKSUM | END |
|:-----:|:---:|:----:|:--------:|:---:|
|  xFF  |  1  |  A   |    64    | xFE |

Checksum is calculated from xor of length and data value. In this case is:

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
PortName = COM7
BaudRate = 9600

[MQTT]
Port = 1883
Server = broker.hivemq.com
UseCredentials =
Username =
Password =
Feed = MySensor
```