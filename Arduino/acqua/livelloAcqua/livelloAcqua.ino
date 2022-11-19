/******************************************
 *Website: www.elegoo.com
 * 
 *Time:2017.12.12
 *
 ******************************************/
int sensore = A0;
int valueSensore = 0;

int led = 13;

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
