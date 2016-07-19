import java.io.*;
public class Main {
  public static void main( String[] ars ) {
    println new EvenFibonacci().function( 4000000 )
  }
}

class EvenFibonacci {
  def function( int a ) {
    def total = 0
    def firstnumber = 1
    def secondnumber = 1
    def placeholder = firstnumber
    while( secondnumber < a ) {
      if( secondnumber.mod( 2 ) == 0 ) {
      total += secondnumber
      }
      placeholder = secondnumber
      secondnumber += firstnumber
      firstnumber = placeholder
    }
    return total
  }
}
