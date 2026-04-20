o=0
for i in range(1,6):
    n=int(input(f"Digite o {i}°número"))
    if  10 >= n <=20:
        o+=1
        print("Esses números estão no intervalo", o)
    else:
         print("Esses numeros não estão no intervalo de 10 á 20")        