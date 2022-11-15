# Food Station
Actually this code read data values from pin A0 and A1, send this values to the Bridge as a packet with serial communication.
It also read from serial a packet and if the data value is an 'A' character it TURN ON the led, otherwise if the data value is an 'S' character it TURN OFF the led.

## Data Packet Structure Received
An example of a data received packet from serial below:

| START | LEN | DATA | CHECKSUM | END |
|:-----:|:---:|:----:|:--------:|:---:|
|  xFF  |  1  |  A   |    64    | xFE |

Checksum is calculated from xor of length and data value. In this case is:

```c
CHECKSUM = LEN ^ DATA = 1 ^ ord('A') = 1 ^ 65 = 64
```

## Data Packet Structure Sent
An example of a data sent packet from serial below:

| START | LEN | DATA_1 | DATA_2 | CHECKSUM | END |
| :---: | :---: | :---: | :---: | :---: | :---: |
| xFF | 2 | 20 | 40 | 62 | xFE |

Checksum is calculated from xor of length and data value. In this case is:

```c
CHECKSUM = LEN ^ DATA_1 ^ DATA_2 = 2 ^ 20 ^ 40 = 62
```