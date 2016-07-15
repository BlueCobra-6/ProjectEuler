import java.io.*;
public class Main {
  public static void main( String[] args ) {
    println new LargestPrimeFactor().function( 600851475143 )
  }
}

class LargestPrimeFactor {
  def function( long a ) {
    def count = 2
    long placeholder = a
    while( placeholder != count ) {
      if( placeholder.mod( count ) == 0 ) {
        placeholder /= count
      } else {
        count++
      }
    }
    return count
  }
}
