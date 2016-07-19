import java.io.*;
public class Main {
  public static void main(String[] args) {
    def starttime = new Date()
    println new ChoosePrimeNumber().calculatePrimeNumber(10001)
    def endtime = new Date()
    println endtime.time - starttime.time
  }
}

class ChoosePrimeNumber {
    def isPrime( int a ) {
      int goal = a
      for( int i = 2; i < a; i++ ) {
        if( goal % i == 0 ) {
          return false
        }
      }
      return true
    }
    def calculatePrimeNumber( int a ) {
      int count = 0
      int currentnumber = 1
      while( count < a ) {
        currentnumber++
        if( isPrime(currentnumber)) {
          count++
        }
      }
      return currentnumber
    }
}
