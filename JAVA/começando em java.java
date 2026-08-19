import java.util.Scanner;
public class Main
{
    //Scanner serve para print ?
     public static void main(String[] args) {
		//Scanner digite= new Scanner(System.in);
		//System.out.println ("Digite seu nome lindo ");
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
	
