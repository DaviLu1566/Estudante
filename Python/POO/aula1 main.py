from cliente import Cliente
from curso import Curso

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
