def media():
    for i in range(3):
        soma = 0        
        digite = float(input("Digite a nota {}: ".format(i + 1)))
        soma += digite
        media = soma / 3
    if media >= 7:
        print("A média das notas é: ", media)
        print("Aprovado")
        
    elif media >= 4 and media <= 6.9:
        print("Recuperação")
    else:
        print("A média das notas é: ", media)
        print("Reprovado")
    


def conversor_moeda():
    valor_em_dolar = 5.16
    valor_em_reias = float(input("Digite o valor em reais: "))
    valor_em_dolar = valor_em_reias / valor_em_dolar
    print("O valor em dólares é: ", valor_em_dolar)

def area_do_retangulo():
        base = float(input("Digite a base do retângulo: "))
        altura = float(input("Digite a altura do retângulo: "))
        perimetro = 2 * (base + altura)
        print("O perímetro do retângulo é: ", perimetro)

def desconto():
    valor = float(input("Digite o valor do produto: "))
    desconto = float(input("Digite o percentual de desconto: "))
    valor_com_desconto = valor - (valor * desconto / 100)
    print("O valor com desconto é: ", valor_com_desconto)
media()
conversor_moeda()
area_do_retangulo()
desconto()