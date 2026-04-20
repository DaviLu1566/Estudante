on=0
for i in range(1,6):
    idade=int(input("Digite uma idade"))
    if idade >= 18:
        print("Maior de idade")
        on += 1
    if idade <=17:
        print("Menor de idade") 
print("A quantidade de maiores de idade são: ", on  )
    
