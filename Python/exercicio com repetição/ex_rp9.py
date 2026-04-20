ap= 0
for i in range(1,6):
    p=float(input("Digite uma nota"))
    if p >=7:
        print ("Aprovado")
        ap +=p
    if p<=6:
      print  ("Recuperação")
    print("quantidade de alunos aprovados: ", ap)