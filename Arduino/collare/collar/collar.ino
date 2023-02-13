/* temperature */
#include <OneWire.h>
#include <DallasTemperature.h>

// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 2

// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

// Microphone plugged into this port
int micPort = A0;

/* ----------- */

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  /* temperature */
  // Start up the library
  sensors.begin();

  /* ----------- */
}

void loop() {
  // put your main code here, to run repeatedly:
  unsigned char temperature = getTemperature();
  Serial.print("temperatura = ");
  Serial.println(temperature);

  unsigned char isBarking = getBark();
  Serial.print("isBarking = ");
  Serial.println(isBarking);
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