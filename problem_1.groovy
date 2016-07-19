import java.io.*;
public class Main {
  public static void main( String[] args ) {
    println new Multiples35().function( 1000 )
  }
}

class Multiples35 {
  def function( int a ) {
    def total = 0
    def test = 1
    while(test < a ) {
      if( test.mod(5) == 0 ) {
        total += test
      } else if( test.mod( 3 ) == 0 ) {
        total += test
      }
      test++
    }
    return total
  }
}
