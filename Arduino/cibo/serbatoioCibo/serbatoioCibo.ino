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

int portion;  //Quantità di volte in cui il servomotore deve aprirsi e chiudersi affinché eroghi 10 grammi di cibo 
int quantity; //Quantità di volte per cui il servomotore deve variare il suo stato (Chiuso-Aperto)
long timer;
int state; //0: Chiuso (0°), 1: Aperto (90°)

NewPing sonar(TRIGGER, ECHO, 400);

void setup() {
  Serial.begin(9600);

  myservo.attach(pin);
  myservo.write(0);

  timer = millis();
  state = 0;
  portion = 5;
  quantity = -1;
}

void loop() {
  /*Ricava la quantità di volte necessaria affinché il
   servomotore eroghi la corretta quantità di cibo*/    
  if(Serial.available() > 0 && quantity == -1)
  {
    quantity = (Serial.read() * portion) / 10;
    Serial.println(quantity);
  }

  if(quantity >= 0)
  {
      if(state == 0 && millis() - timer > 2000)
      {
        myservo.write(90);
        quantity--;
        timer = millis();
        state = 1;
      }
      if(state == 1 && millis() - timer > 2000)
      {
        myservo.write(0);
        timer = millis();
        state = 0;
      }
  }
  else
    myservo.write(0);

  //stampa del livello di cibo (sensore ultrasuoni)
  Serial.println(sonar.ping_cm());
}