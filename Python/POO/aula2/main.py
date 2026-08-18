from client import Cliente
from curso import Curso
from Pessoa import Pessoa
cliente = Cliente("Davi", "123.456.789-00", 20, "davi@email.com")
curso = Curso("Python", 80, 299.90)

print("=== CLIENTE ===")
print("Nome:", cliente.nome)
print("CPF:", cliente.cpf)
print("Idade:", cliente.idade)
print("Email:", cliente.email)

print("\n=== CURSO ===")
print("Nome:", curso.nome)
print("Carga Horária:", curso.carga_horaria)
print("Valor: R$", curso.valor)

def main():
    print("Cadastro de nova pessoa ")
    dgt_nome = input("Digite seu nome " )
    idade = input ("Digite sua idade " )
    cpf = input ("Digite seu CPF " )
    email_in = input("Digite seu email. ")
    p2 = Pessoa (dgt_nome, idade, cpf, email_in)
main()

#class é para criar casses para começar a fazer o objeto
class Pessoa:
    def __init__(self, nome, idade, cpf, email):
        self.nome = nome 
        self.idade = idade 
        self.cpf = cpf
        self.email = email



class Cliente:
    def __init__(self, nome, cpf, idade, email):
        self.nome = nome
        self.cpf = cpf
        self.idade = idade
        self.email = email
class Curso:
    def __init__ (self, nome,carga_horaria, valor):
        self.nome = nome
        self.carga_horaria = carga_horaria
        self.valor = valor

    
