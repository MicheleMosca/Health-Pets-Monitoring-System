/*
    LoRa Arduino Uno

    SCK - 13
    MISO - 12
    MOSI - 11
    NSS - 10
    RST - 9
    DIO0 - 2
*/

#include <LoRa.h>
#define SEND_INTERVAL 10000 // every 10 seconds

/* LoRa Send variables */
unsigned long timestamp;

void setup() {
  //initialize Serial Monitor
  Serial.begin(9600);
  
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
  //Send LoRa packet to receiver
  
  LoRaSerialSend(1, 36, 80, 1);
  
}

int LoRaSerialSend(unsigned char animal_id, unsigned char temperature, unsigned char beats, unsigned char bark)
{
  int checksum;
  
  if (millis() - timestamp > SEND_INTERVAL)
  {
    Serial.println("send data");
    // checksum is calculated by xor of lenght ^ data_1 ^ data_2
    checksum = 4 ^ animal_id ^ temperature ^ beats ^ bark;
    
    // data package: FF 2 data_1 data_2 FE
    LoRa.beginPacket();
    
    LoRa.write(0xFF); // package start
    
    LoRa.write(4);  // data lenght

    LoRa.write(animal_id);
    LoRa.write(temperature);
    LoRa.write(beats);
    LoRa.write(bark);
    
    LoRa.write(checksum); // checksum

    LoRa.write(0xFE); // package end

    LoRa.endPacket();
    
    timestamp = millis();

    return 1;
  }
  return 0;
}
