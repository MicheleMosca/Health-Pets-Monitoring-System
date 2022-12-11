#define PIN 13
#define SEND_INTERVAL 15000 // every 15 seconds

/* Serial Send variables */
unsigned long timestamp;

/* Serial Receive variables */
#define BUFFDIM 5 // header, size, data, checksum, footer

unsigned char ucInBuffer[BUFFDIM];  // Buffer to memorize packet bytes 
size_t stBufferIndex;     // Index of the buffer

void setup()
{
  /* Serial Send setup */
  Serial.begin(9600);
  timestamp = millis();

  /* Serial Receive setup */
  pinMode(PIN, OUTPUT);

  for (stBufferIndex = 0; stBufferIndex < BUFFDIM; stBufferIndex++)
    ucInBuffer[stBufferIndex] = 0;

  stBufferIndex = 0;
  
}

void loop()
{
  // Serial Send Trial
  serialSend('h', 'm', 1, 20, 2, 1, 36);
  // serialReceive();
}

void serialSend(char food_level, char water_level, char animal_id, char animal_beat, char animal_weight, char animal_bark, char animal_temperature)
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
  }
}

void serialReceive()
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

      useData();

      // Clear buffer
      for (stBufferIndex = 0; stBufferIndex < BUFFDIM; stBufferIndex++)
        ucInBuffer[stBufferIndex] = 0;

      stBufferIndex = 0;
    }
    else
    {
      // Append
      ucInBuffer[stBufferIndex] = ucData;
      stBufferIndex++;
    }
  }  
}

/* Elaborate received data */
void useData()
{
  if (stBufferIndex < BUFFDIM)  // at least header, size, data, checksum, footer
    return;

  if (ucInBuffer[0] != 0xFF)
    return;

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
    return;
   
  for (size_t i = 0; i < ucNumVal; i++)
  {
    // use of values
    if (ucVal[i] == 'A')
      digitalWrite(PIN, HIGH);
    if (ucVal[i] == 'S')
      digitalWrite(PIN, LOW);
  }
}
