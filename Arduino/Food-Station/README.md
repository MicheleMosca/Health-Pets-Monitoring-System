# Food Station
First darft of Food Station arduino code.
It can receive meal input from the bridge and for now if the animal id is 1 turn on the led (it will be replaced with the servo motor input to fill the food tray).
It also can send to the Bridge station's sensors value and animal's sensors value every 25 seconds.

## Data Packet Structure Received
An example of a data received packet from serial below:

| START | LEN | ANIMAL_ID | MEAL_TYPE | QUANTITY | CHECKSUM | END |
|:-----:|:---:|:---------:|:---------:|:--------:|:--------:|:---:|
|  xFF  |  3  |     1     |     s     |    2     |   112    | xFE |

Checksum is calculated from xor of length and data value. An example here:

```c
CHECKSUM = LEN ^ DATA = 1 ^ ord('A') = 1 ^ 65 = 64
```

## Data Packet Structure Sent
An example of a data sent packet to serial below:

| START | LEN | FOOD_LEVEL | WATER_LEVEL | ANIMAL_ID | ANIMAL_BEAT | ANIMAL_WEIGHT | ANIMAL_BARK | ANIMAL_TEMPERATURE | CHECKSUM | END |
|:-----:|:---:|:----------:|:-----------:|:---------:|:-----------:|:-------------:|:-----------:|:------------------:|:--------:|:---:|
|  xFF  |  7  |     h      |      m      |     1     |     20      |       2       |      1      |         36         |    48    | xFE |

Checksum is calculated from xor of length and data value. An example here:

```c
CHECKSUM = LEN ^ DATA_1 ^ DATA_2 = 2 ^ 20 ^ 40 = 62
```
