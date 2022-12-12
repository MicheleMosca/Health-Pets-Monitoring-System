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
}

void loop()
{
  // Serial Send Trial
  serialSend('h', 'm', 1, 20, 2, 1, 36);
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
