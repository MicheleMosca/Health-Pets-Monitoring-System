#define PIN 13
#define SEND_INTERVAL 25000 // every 25 seconds

/* Serial Send variables */
unsigned long timestamp;

/* Serial Receive variables */
#define BUFFDIM 7 // header, size, animal_id, meal_type, quantity, checksum, footer
unsigned char animal_id = 0;
unsigned char meal_type = 'u';
unsigned char quantity = 0;

unsigned char ucInBuffer[BUFFDIM];  // Buffer to memorize packet bytes 
size_t stBufferIndex;     // Index of the buffer

/* Water system */
int waterLevelSensor = A0;
int ledWater = 7;
int waterLevelValue = 0;
/* ------------ */

/* Food system */
#include <Servo.h>
#include "NewPing.h"

#define servo 2

#define TRIGGER 3
#define ECHO 4

Servo myservo;

long servoTimer;
int servoStatus = 0;

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

LiquidCrystal lcd (8, 9, 10, 11, 12, 13);

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
  pinMode(PIN, OUTPUT);
  digitalWrite(PIN, LOW);

  for (stBufferIndex = 0; stBufferIndex < BUFFDIM; stBufferIndex++)
    ucInBuffer[stBufferIndex] = 0;

  stBufferIndex = 0;

  /* Water system */
  pinMode(ledWater, OUTPUT);
  /* ------------ */

  /* Food system */
  myservo.attach(servo);
  servoTimer = millis();
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
}

void loop()
{
  unsigned char water = waterSystem();
  unsigned char food = foodSystem();
  unsigned char weight = weightSystem();
  menu(water, food, weight);

  // Serial Send Trial
  serialSend(food, water, 1, 20, weight, 1, 36);
  int r = serialReceive(&animal_id, &meal_type, &quantity);

  // if we recived a packet do something (turn on led for example)
  if (r == 1 && animal_id == 1)
    digitalWrite(PIN, HIGH);
}

int serialSend(unsigned char food_level, unsigned char water_level, unsigned char animal_id, unsigned char animal_beat, unsigned char animal_weight, unsigned char animal_bark, unsigned char animal_temperature)
{
  int checksum;
  
  if (millis() - timestamp > SEND_INTERVAL)
  {
    // checksum is calculated by xor of lenght ^ data_1 ^ data_2
    checksum = 7 ^ food_level ^ water_level ^ animal_id ^ animal_beat ^ animal_weight ^ animal_bark ^ animal_temperature;
    
    // data package: FF 2 data_1 data_2 FE
    
    Serial.write(0xFF); // package start
    
    Serial.write(7);  // data lenght
    
    Serial.write(food_level);
    Serial.write(water_level);
    Serial.write(animal_id);
    Serial.write(animal_beat);
    Serial.write(animal_weight);
    Serial.write(animal_bark);
    Serial.write(animal_temperature);

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
  if (stBufferIndex < BUFFDIM)  // at least header, size, animal_id, meal_type, quantity, checksum, footer    IL PROBLEMA E' QUI
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
    digitalWrite(ledWater, HIGH);
  }else{
    digitalWrite(ledWater, LOW);
  }

  return((unsigned char)waterLevelValue);
}

unsigned char foodSystem(){
  // NOTA: da fare un loop di 5 volte (1 dose di cibo)

  long new_timer = millis();
  if(new_timer - servoTimer > 2000 && servoStatus == 0){
    myservo.write(0);
    servoStatus = 1;
    servoTimer = millis();
  }else if(new_timer - servoTimer > 2000 && servoStatus == 1){
    myservo.write(90);
    servoStatus = 0;
    servoTimer = millis();
  }

  return((unsigned char)sonar.ping_cm());
}

unsigned char weightSystem(){  
  scale.set_scale(calibration_factor);

  return((unsigned char)scale.get_units(),0);
}

void menu(char water, char food, char weight){
  char customKey = customKeypad.getKey();
  
  if(customKey == 'A'){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Menu");
    lcd.setCursor(0,1);
    lcd.print("1: weight = ");
    lcd.print((float)weight);
    statusKey = 0;
  }else if(customKey == '8' && statusKey == 0){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("1: weight = ");
    lcd.print((float)weight);
    lcd.setCursor(0,1);
    lcd.print("2: food = ");
    lcd.print((int)food);
    statusKey = 1;
  }else if(customKey == '8' && statusKey == 1){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("2: food = ");
    lcd.print((int)food);
    lcd.setCursor(0,1);
    lcd.print("3: water = ");
    lcd.print((int)water);
    statusKey = 2;
  }else if(customKey == '2' && statusKey == 1){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("Menu");
    lcd.setCursor(0,1);
    lcd.print("1: weight = ");
    lcd.print((float)weight);
    statusKey = 1;
  }else if(customKey == '2' && statusKey == 2){
    lcd.clear();
    lcd.setCursor(0,0);
    lcd.print("1: weight = ");
    lcd.print((float)weight);
    lcd.setCursor(0,1);
    lcd.print("2: food = ");
    lcd.print((int)food);
    statusKey = 0;
  }
}
