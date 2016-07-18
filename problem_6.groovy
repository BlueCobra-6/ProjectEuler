import java.io.*;  
public class Main {  
  public static void main(String[] args) {  
    println new defferenceSumofSquaresandSquareofSum().difference(100)  
  }  
}  

class differenceSumofSquaresandSquareofSum 
  def difference( int a ) {
    return SquareofSum(a) - SumofSquares(a)
  }
  
  def SquareofSum( int a ) {
    def total = 0
    for( int i = 1; i <= a; i++ ) {
      total += i
    }
    return total * total
  }
  
  def SumofSquares( int a ) {
    def total = 0
    for( int i = 1; i <= a; i++ ) {
      total += (i * i )
    }
    return total
  }
}
