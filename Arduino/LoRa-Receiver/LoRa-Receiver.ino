/*
    LoRa - Mega 2560
    
    MISO - 50
    MOSI - 51
    SCK - 52
    SS - 53
    RST - 9
    DIO0 - 8 ( I always want to avoid using GPIO 0 and 2)
*/

#include <LoRa.h>
#define BUFFDIM_LoRa 8 // header, size, animal_id, temperature, beats, bark, checksum, footer
unsigned char animal_id = 0;
unsigned char temperature = 0;
unsigned char beats = 0;
unsigned char bark = 0;

unsigned char ucInBufferLoRa[BUFFDIM_LoRa];  // Buffer to memorize packet bytes 
size_t stBufferIndexLoRa;     // Index of the buffer

#define LORA_SS 53
#define LORA_RST 9
#define LORA_DIO0 8

void setup() {
  //initialize Serial Monitor
  Serial.begin(9600);

  //setup LoRa transceiver module
  LoRa.setPins(LORA_SS, LORA_RST, LORA_DIO0);
  
  //replace the LoRa.begin(---E-) argument with your location's frequency 
  //433E6 for Asia
  //866E6 for Europe
  //915E6 for North America
  while (!LoRa.begin(433E6)) {
    Serial.println("Non va");
    delay(500);
  }
   // Change sync word (0xF3) to match the receiver
  // The sync word assures you don't get LoRa messages from other LoRa transceivers
  // ranges from 0-0xFF
  LoRa.setSyncWord(0xF3);
  Serial.println("LoRa Initializing OK!");
}

void loop() {

  unsigned char distance = 3;
  
  if (LoRaReceive(&animal_id, &temperature, &beats, &bark, &distance) == 1)
  {
    Serial.print("animal_id: ");
    Serial.print(animal_id);
    Serial.print("temperature: ");
    Serial.print(temperature);
    Serial.print("beats: ");
    Serial.print(beats);
    Serial.print("bark: ");
    Serial.print(bark);
    Serial.print("Distance: ");
    Serial.println(distance);  
  }
}

int LoRaReceive(unsigned char *animal_id, unsigned char *temperature, unsigned char *beats, unsigned char *bark, unsigned char *distance)
{
  int packetSize = LoRa.parsePacket();
  if (packetSize) 
  {
    Serial.println("qualcosa c'è");
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
          Serial.print("RSSI ");
          Serial.println(LoRa.packetRssi());
          *distance = (unsigned char) abs(LoRa.packetRssi()) / 100;
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
  Serial.println("-----------------");
  for (int i = 0; i < BUFFDIM_LoRa; i++)
    Serial.println(ucInBufferLoRa[i]);
  Serial.println("------------------");

  // calculate checksum and getting values
  unsigned char ucChecksum = ucNumVal;
  unsigned char ucVal[ucNumVal];
  for (size_t i = 0; i < ucNumVal; i++)
  {
    ucVal[i] = ucInBufferLoRa[i + 2];
    ucChecksum = ucChecksum ^ ucVal[i]; 
  }
  
  unsigned char ucChecksum_received = ucInBufferLoRa[BUFFDIM_LoRa - 2];

  Serial.println(ucChecksum_received);
  Serial.println(ucChecksum);
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
