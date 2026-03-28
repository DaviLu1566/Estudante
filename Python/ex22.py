pes=float(input("Qual é seu peso ? "))
alt=float(input("Qual é a sua altura ? "))
imc=pes/alt**2;
if imc <18.5:
    print ("Abaixo do peso")
elif imc >=18.6 and imc<= 24.9:
    print("Peso normal")
elif imc >=25.0 and imc<= 29.9:
    print("Sobrepeso")
elif imc >=30.9 and imc<= 34.9:
    print("Obesidade 1° Grau")
elif imc >=35 and imc<= 39.9:
    print("Obesidade 2° Grau (Severa)")
elif imc >40.0:
    print("Obesidade 3° Grau (Mórbida)")
