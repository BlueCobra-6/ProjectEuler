import java.io.*;
public class Main {
  public static void main(String[] args) {
    println new sumofprime().function( 100000 )
  }
}

class sumofprime {
    def function( int input ) {
        int total = 0
        def array = []
        for( def count = 2; count < input; count++ ) {
            isPrime( count, array )
        }
        for( def count = 0; count < array.size(); count++ ) {
            total += count
        }
        return total
    }

    def isPrime( int a, def array ) {
        int goal = a
        int size = array.size() >> 1
        for( int i = 0; i < size; i++ ) {
            if( goal % array[i] == 0 ) {
                return false
            }
        }
        array[array.size()] = a
        return true
    }
}
