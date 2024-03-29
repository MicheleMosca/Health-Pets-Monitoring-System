#define SEND_INTERVAL 10000 // every 10 seconds

unsigned char weight = 0;

/* Serial Send variables */
unsigned long timestamp;

/* Serial Receive variables */
#define BUFFDIM 7 // header, size, animal_id, meal_type, quantity, checksum, footer
unsigned char animal_id_received = 0;
unsigned char meal_type = 'u';
unsigned char quantity = 0;

unsigned char ucInBuffer[BUFFDIM];  // Buffer to memorize packet bytes 
size_t stBufferIndex;     // Index of the buffer

/* LoRa Receive variables */
#include <LoRa.h>
#define BUFFDIM_LoRa 8 // header, size, animal_id, temperature, beats, bark, checksum, footer

unsigned char animal_id = 0;
unsigned char temperature = 0;
unsigned char beats = 0;
unsigned char bark = 0;
unsigned char distance = 3;

unsigned char ucInBufferLoRa[BUFFDIM_LoRa];  // Buffer to memorize packet bytes 
size_t stBufferIndexLoRa;     // Index of the buffer

#define LORA_SS 53
#define LORA_RST 9
#define LORA_DIO0 8

/* Water system */
int waterLevelSensor = A0;
int ledWater = 7;
int waterLevelValue = 0;
/* ------------ */

/* Food system */
#include <Servo.h>
#include "NewPing.h"

#define servo 30

#define TRIGGER 3
#define ECHO 4

Servo myservo;

int portion_food;  //Quantità di volte in cui il servomotore deve aprirsi e chiudersi affinché eroghi 10 grammi di cibo 
int quantity_food; //Quantità di volte per cui il servomotore deve variare il suo stato (Chiuso-Aperto)
long timer_food;
int state_food; //0: Chiuso (0°), 1: Aperto (90°)

NewPing sonar(TRIGGER,ECHO, 400);
/* ----------- */

/* weight system */
#include "HX711.h"

#define DOUT  5
#define CLK  6

HX711 scale;

float calibration_factor = 7050;

/* ------------- */

/* display */
#include <LiquidCrystal.h>

LiquidCrystal lcd (32, 33, 34, 35, 36, 38);

/* ------- */

/* keypad */
#include <Keypad.h>

const byte ROWS = 4; //four rows
const byte COLS = 4; //four columns
//define the cymbols on the buttons of the keypads
char hexaKeys[ROWS][COLS] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
byte rowPins[ROWS] = {29, 28, 27, 26}; //connect to the row pinouts of the keypad
byte colPins[COLS] = {25, 24, 23, 22}; //connect to the column pinouts of the keypad

//initialize an instance of class NewKeypad
Keypad customKeypad = Keypad( makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS); 

int statusKey = 0;

/* ------ */

void setup()
{
  /* Serial Send setup */
  Serial.begin(9600);
  timestamp = millis();

  /* Serial Receive setup */
  for (stBufferIndex = 0; stBufferIndex < BUFFDIM; stBufferIndex++)
    ucInBuffer[stBufferIndex] = 0;

  stBufferIndex = 0;

  /* Water system */
  pinMode(ledWater, OUTPUT);
  /* ------------ */

  /* Food system */
  myservo.attach(servo);
  myservo.write(90);

  timer_food = millis();
  state_food = 0;
  portion_food = 5;
  quantity_food = -1;
  /* ----------- */

  /* weight system */
  //inizializzazione
  scale.begin(DOUT, CLK);
  scale.set_scale();
  scale.tare();

  long zero_factor = scale.read_average();
  /* ------------- */

  /* display */
  lcd.begin(16, 2);
  /* ------- */

  /* LoRa Setup */
  //setup LoRa transceiver module
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);

  while (!LoRa.begin(433E6)) {
    Serial.println("LoRa doesn't begin!");
    delay(500);
  }

  // The sync word assures you don't get LoRa messages from other LoRa transceivers
  // ranges from 0-0xFF
  LoRa.setSyncWord(0xF3);
}

void loop()
{
  unsigned char water = waterSystem();
  unsigned char food = foodSystem();
  if (distance <= 1)
    weight = weightSystem();
  menu(water, food, weight);

  // LoRa Receive
  LoRaReceive(&animal_id, &temperature, &beats, &bark, &distance);

  // Serial Send Trial
  serialSend(food, water, animal_id, beats, weight, bark, temperature, distance);
  int r = serialReceive(&animal_id_received, &meal_type, &quantity);

  // if we recived a packet do something (turn on led for example)
  if (r == 1)
  {
    quantity_food = (quantity * portion_food) / 10;
  }

  foodRelease();
}

int serialSend(unsigned char food_level, unsigned char water_level, unsigned char animal_id, unsigned char animal_beat, unsigned char animal_weight, unsigned char animal_bark, unsigned char animal_temperature, unsigned char distance)
{
  int checksum;
  
  if (millis() - timestamp > SEND_INTERVAL)
  {
    // checksum is calculated by xor of lenght ^ data_1 ^ data_2
    checksum = 8 ^ food_level ^ water_level ^ animal_id ^ animal_beat ^ animal_weight ^ animal_bark ^ animal_temperature ^ distance;
    
    // data package: FF 2 data_1 data_2 FE
    
    Serial.write(0xFF); // package start
    
    Serial.write(8);  // data lenght
    
    Serial.write(food_level);
    Serial.write(water_level);
    Serial.write(animal_id);
    Serial.write(animal_beat);
    Serial.write(animal_weight);
    Serial.write(animal_bark);
    Serial.write(animal_temperature);
    Serial.write(distance);

    Serial.write(checksum); // checksum

    Serial.write(0xFE); // package end
    
    timestamp = millis();

    return 1;
  }
  return 0;
}

int serialReceive(unsigned char *animal_id, unsigned char *meal_type, unsigned char *quantity)
{
  // If there are some data from the serial
  if (Serial.available() > 0)
  {
    unsigned char ucData;
    ucData = Serial.read(); // read a byte
    if (ucData == 0xFE) // EOF
    {
      // Append last byte
      ucInBuffer[stBufferIndex] = ucData;
      stBufferIndex++;
      int r = useData(&animal_id, &meal_type, &quantity);

      // Clear buffer
      for (stBufferIndex = 0; stBufferIndex < BUFFDIM; stBufferIndex++)
        ucInBuffer[stBufferIndex] = 0;

      stBufferIndex = 0;
      if (r == 1)
        return 1;
    }
    else
    {
      // Append
      ucInBuffer[stBufferIndex] = ucData;
      stBufferIndex++;
    }
  }
  
  return 0;  
}

/* Elaborate received data */
int useData(unsigned char **animal_id, unsigned char **meal_type, unsigned char **quantity)
{
  if (stBufferIndex < BUFFDIM)  // at least header, size, animal_id, meal_type, quantity, checksum, footer
    return 0;

  if (ucInBuffer[0] != 0xFF)
    return 0;

  unsigned char ucNumVal = ucInBuffer[1];

  // calculate checksum and getting values
  unsigned char ucChecksum = ucNumVal;
  unsigned char ucVal[ucNumVal];
  for (size_t i = 0; i < ucNumVal; i++)
  {
    ucVal[i] = ucInBuffer[i + 2];
    ucChecksum = ucChecksum ^ ucVal[i]; 
  }
  
  unsigned char ucChecksum_received = ucInBuffer[BUFFDIM - 2];
  
  // check if checksum is correct
  if (ucChecksum != ucChecksum_received)
    return 0;
   
  // use of value
  *(*animal_id) = ucVal[0];
  *(*meal_type) = ucVal[1];
  *(*quantity) = ucVal[2];
  return 1;
}

unsigned char waterSystem(){
  waterLevelValue = analogRead(waterLevelSensor);
  if(waterLevelValue < 100){
    digitalWrite(ledWater, HIGH);   // warning led signal on
    return 'l';
  }
  else if (waterLevelValue >= 100 && waterLevelValue <= 300){
    digitalWrite(ledWater, LOW);  // warning led signal off
    return 'm';
  }
  else if (waterLevelValue > 300)
  {
    digitalWrite(ledWater, LOW);  // warning led signal off
    return 'h';
  }

  return 'l';
}

void foodRelease()
{
  if(quantity_food >= 0)
  {
      if(state_food == 0 && millis() - timer_food > 2000)
      {
        myservo.write(0);
        quantity_food--;
        timer_food = millis();
        state_food = 1;
      }
      if(state_food == 1 && millis() - timer_food > 2000)
      {
        myservo.write(90);
        timer_food = millis();
        state_food = 0;
      }
  }
  else
    myservo.write(90);
}

unsigned char foodSystem(){
  
  // 20cm low; 9cm medium; 3cm high
  unsigned char ping = sonar.ping_cm();

  if (ping >= 8)
    return 'l';
  else if (ping < 8 && ping > 3)
    return 'm';
  else if (ping <= 3)
    return 'h';
  
  return 'l';
}

unsigned char weightSystem(){  
  scale.set_scale(calibration_factor);

  return (unsigned char)scale.get_units();
}

void menu(char water, char food, char weight){
  char customKey = customKeypad.getKey();
  
  if(customKey == 'A' || (statusKey == 0 && customKey == 0)){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Menu ");
    lcd.setCursor(0,1);
    lcd.print("weight = ");
    lcd.print((float)weight);
    lcd.print("kg");
    statusKey = 0;
  }else if((customKey == '8' && statusKey == 0) || (statusKey == 1 && customKey == 0)){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("weight = ");
    lcd.print((float)weight);
    lcd.print("kg");
    lcd.setCursor(0,1);
    lcd.print("food = ");
    lcd.print(food);
    statusKey = 1;
  }else if((customKey == '8' && statusKey == 1) || (statusKey == 2 && customKey == 0)){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("food = ");
    lcd.print(food);
    lcd.setCursor(0,1);
    lcd.print("water = ");
    lcd.print(water);
    statusKey = 2;
  }else if((customKey == '2' && statusKey == 2) || (statusKey == 2 && customKey == 0)){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("weight = ");
    lcd.print("kg");
    lcd.print((float)weight);
    lcd.setCursor(0,1);
    lcd.print("food = ");
    lcd.print(food);
    statusKey = 1;
  }else if((customKey == '2' && statusKey == 1) || (statusKey == 1 && customKey == 0)){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Menu");
    lcd.setCursor(0,1);
    lcd.print("weight = ");
    lcd.print((float)weight);
    lcd.print("kg");
    statusKey = 0;
  }
}

int LoRaReceive(unsigned char *animal_id, unsigned char *temperature, unsigned char *beats, unsigned char *bark, unsigned char *distance)
{
  int packetSize = LoRa.parsePacket();
  if (packetSize) 
  {
    // If there are some data from the serial
    while (LoRa.available() > 0)
    {
      unsigned char ucData;
      ucData = LoRa.read(); // read a byte
      if (ucData == 0xFE) // EOF
      {
        // Append last byte
        ucInBufferLoRa[stBufferIndexLoRa] = ucData;
        stBufferIndexLoRa++;
  
        int r = LoRaUseData(&animal_id, &temperature, &beats, &bark);
  
        // Clear buffer
        for (stBufferIndexLoRa = 0; stBufferIndexLoRa < BUFFDIM_LoRa; stBufferIndexLoRa++)
          ucInBufferLoRa[stBufferIndexLoRa] = 0;
  
        stBufferIndexLoRa = 0;
        if (r == 1)
        {
          // print RSSI of packet
          *distance = (unsigned char) abs(LoRa.packetRssi() / 100);
          return 1;
        }
      }
      else
      {
        // Append
        ucInBufferLoRa[stBufferIndexLoRa] = ucData;
        stBufferIndexLoRa++;
      }
    }
  }
  
  return 0;  
}

int LoRaUseData(unsigned char **animal_id, unsigned char **temperature, unsigned char **beats, unsigned char **bark)
{
  if (stBufferIndexLoRa < BUFFDIM_LoRa)  // at least header, size, animal_id, meal_type, quantity, checksum, footer
    return 0;
    
  if (ucInBufferLoRa[0] != 0xFF)
    return 0;
    
  unsigned char ucNumVal = ucInBufferLoRa[1];

  // calculate checksum and getting values
  unsigned char ucChecksum = ucNumVal;
  unsigned char ucVal[ucNumVal];
  for (size_t i = 0; i < ucNumVal; i++)
  {
    ucVal[i] = ucInBufferLoRa[i + 2];
    ucChecksum = ucChecksum ^ ucVal[i]; 
  }
  
  unsigned char ucChecksum_received = ucInBufferLoRa[BUFFDIM_LoRa - 2];

  // check if checksum is correct
  if (ucChecksum != ucChecksum_received)
    return 0;
  
  // use of value
  *(*animal_id) = ucVal[0];
  *(*temperature) = ucVal[1];
  *(*beats) = ucVal[2];
  *(*bark) = ucVal[3];
  return 1;
}
