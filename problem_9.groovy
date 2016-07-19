import java.io.*;
public class Main {
  public static void main(String[] args) {
    println function(1000)
  }
}

def function( int input ) {
  int a =1, b = 2, c = input - a - b
  while( a*a + b*b != c*c ) {
    b++
    c--
    if( b >= c ) {
      a++
      b = a + 1
      c = input - a - b
    }
    if( b > c ) {
      return "No Pythagorean Triplet"
    }
  }
  return a*b*c
}
