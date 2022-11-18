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
  serialSend();
  serialReceive();
}

void serialSend()
{
  int data_1;
  int data_2;
  int checksum;
  
  if (millis() - timestamp > SEND_INTERVAL)
  {
    data_1 = map(analogRead(0),0,1023,0,253);
    data_2 = map(analogRead(1),0,1023,0,253);

    // checksum is calculated by xor of lenght ^ data_1 ^ data_2
    checksum = 2 ^ data_1 ^ data_2;
    
    // data package: FF 2 data_1 data_2 FE
    
    Serial.write(0xFF); // package start
    
    Serial.write(2);  // data lenght
    
    Serial.write(data_1);
    Serial.write(data_2);

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
