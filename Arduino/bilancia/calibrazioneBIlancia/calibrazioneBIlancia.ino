/******************************************
Sistema per pesare l'animale.

4 celle di carico
1 modulo HX711

Le celle di carico sono posizionate in corrispondenza 
dei 4 angoli di una struttura in legno.
Sopra le celle di carico viene appoggiato un piano
in compensato in modo da piegare la parte mobile
delle celle di carico per pesare l'animale.
Le celle di carico sono collegate ad Arduino tramite
il modulo HX711. 

 ******************************************/

#include "HX711.h"

#define DOUT  5
#define CLK  6

HX711 scale;

float calibration_factor = -7050;

void setup() {
  Serial.begin(9600);

  //stampe per la calibrazione bilancia
  Serial.println("HX711 calibration sketch");
  Serial.println("Remove all weight from scale");
  Serial.println("After readings begin, place known weight on scale");
  Serial.println("Press + or a to increase calibration factor");
  Serial.println("Press - or z to decrease calibration factor");

  //inizializzazione
  scale.begin(DOUT, CLK);
  scale.set_scale();
  scale.tare();

  long zero_factor = scale.read_average();
  Serial.print("Zero factor: ");
  Serial.println(zero_factor);
}

void loop() {
  delay(2000);
   
  scale.set_scale(calibration_factor);

  //stampe relative al peso dell'animale
  Serial.print("Reading: ");
  Serial.print(scale.get_units(),2);
  Serial.print(" kg");
  Serial.print(" calibration_factor: ");
  Serial.print(calibration_factor);
  Serial.println();

  //comandi per calibrare la bilancia e per tararla
  if(Serial.available())
  {
    char temp = Serial.read();
    if(temp == '+' || temp == 'a')
      calibration_factor += 10;
    else if(temp == '-' || temp == 'z')
      calibration_factor -= 10;
    else if(temp == 't')
      scale.tare();
  }
}