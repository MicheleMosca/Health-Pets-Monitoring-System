/******************************************
Sistema per il controllo del cibo.

1 ciotola
1 bottiglia
1 sensore: Ultrasonic SensorModule
1 attuatore: servomotore

La bottiglia posizionata a testa in giù fa
da serbatoio per il cibo.
Nella parte superiore è posizionato il sensore
a ultrasuoni per rilevare la presenza o meno
del cibo (un livello alto indica che manca il cibo).
Nella parte inferiore è posizionato il servomotore 
con un cartoncino fissato sul braccio che fa da 
apri/chiudi.

 ******************************************/


#include <Servo.h>
#include "NewPing.h"

Servo myservo;

#define pin 2

#define TRIGGER 3
#define ECHO 4

long timer;
int stato = 0;

NewPing sonar(TRIGGER, ECHO, 400);

void setup() {
  Serial.begin(9600);

  myservo.attach(pin);

  timer = millis();
}

void loop() {
  //da fare un loop di 5 volte (1 dose di cibo)

  //attiva e disattiva il servomotore  
  long new_timer = millis();
  if (new_timer - timer > 2000 && stato == 0)
  {
    myservo.write(0);
    stato = 1;
    timer = millis();
  }
  else if (new_timer - timer > 2000 && stato == 1)
  {
    myservo.write(90);
    stato = 0;
    timer = millis();
  }

  //stampa del livello di cibo (sensore ultrasuoni)
  Serial.println(sonar.ping_cm());
}