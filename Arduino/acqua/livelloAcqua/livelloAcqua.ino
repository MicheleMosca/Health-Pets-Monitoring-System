/******************************************
Sistema per il livello dell'acqua.

1 ciotola
1 sensore: Water Level Detection Sensor Module
1 led

Il sensore è posizionato su uno dei lati della ciotola
e misura il livello di acqua: se il livello supera
una certa soglia (in questo caso 100) allora
viene attivato un led che simula il riempimento
dell'acqua tramite un meccanismo automatico

 ******************************************/
int sensore = A0;
int led = 7;
int valoreSensore = 0;

void setup()
{
  pinMode(led, OUTPUT);
  Serial.begin(9600);
}

void loop()
{
    int valoreSensore = analogRead(sensore); // get adc value
    Serial.print("valore sensore =");
    Serial.println(valoreSensore);
    if(valoreSensore < 100){
      digitalWrite(led, HIGH);
    }else{
      digitalWrite(led, LOW);
    }
}
