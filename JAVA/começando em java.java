import java.util.Scanner;
public class Main
{
     public static void main(String[] args) {
	// é preciso criar as variaveis antes de começar a codar, se for uma letra defini-se String, já se for numero inteiro se define "Int"
	// Já o float serve para definir um número quebrado.
	//Scanner digite= new Scanner(System.in); essa parte serve para definir uma coisa para digitar.
	//System.out.println ("Digite seu nome lindo "); System.out.print serve para printar.
	//String nome= digite.nextLine(); 
	//System.out.println ("Seu nome é " + nome );
	//System.out.println("olá " + nome + " que nome horrivel ")
	float base, altura;
	Scanner calculo= new Scanner(System.in);
	System.out.print(" Digite a base ");
    base= calculo.nextFloat();    	
	System.out.print(" Digite a altura ");
	altura= calculo.nextFloat();
	System.out.print(" O resultado da área é: " + base*altura);
	
