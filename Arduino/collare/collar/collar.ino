/* temperature */
#include <OneWire.h>
#include <DallasTemperature.h>

// Data wire is plugged into port 3 on the Arduino
#define ONE_WIRE_BUS 3

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

// Microphone plugged into this port
int micPort = A0;

/* ----------- */

/* LoRa Sender variables */
#include <LoRa.h>
#define SEND_INTERVAL 10000 // every 10 seconds

unsigned long timestamp;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  /* temperature */
  // Start up the library
  sensors.begin();

  /* ----------- */

  /* LoRa Sender Setup */
  while (!LoRa.begin(433E6)) {
    Serial.println("LoRa doesn't begin!");
    delay(500);
  }

  // The sync word assures you don't get LoRa messages from other LoRa transceivers
  // ranges from 0-0xFF
  LoRa.setSyncWord(0xF3);
  Serial.println("LoRa Initializing OK!");
}

void loop() {
  // put your main code here, to run repeatedly:
  unsigned char temperature = getTemperature();
  Serial.print("temperatura = ");
  Serial.println(temperature);

  unsigned char isBarking = getBark();
  Serial.print("isBarking = ");
  Serial.println(isBarking);

  LoRaSerialSend(1, temperature, 80, isBarking);  // animal_id, temperature, beats, bark
}

unsigned char getTemperature(){
  sensors.requestTemperatures(); // Send the command to get temperatures
  return sensors.getTempCByIndex(0);
}

unsigned char getBark(){
  int loudness = analogRead(micPort);

  if(loudness < 400)
    return 0;
  else
    return 1;
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
