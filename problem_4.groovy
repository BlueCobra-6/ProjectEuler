import java.io.*;
public class Main {
  public static void main(String[] args) {
    println new LargestPalindrome().function(3)
  }
}

class LargestPalindrome {
  def function( int a ) {
    def firstnumber = pow( a ) - 1
    def secondnumber = firstnumber
    def test = firstnumber * secondnumber
    def largestnumber = 0
    while( true ) {
      if( testP( test ) && test > largestnumber ) {
        largestnumber = test
      }
      secondnumber--
      if( secondnumber < pow( a - 1 )) {
        firstnumber--
        if( firstnumber < pow( a - 1 )) {
          if( largestnumber == 0 ) {
            return "No palindrome in this range"
          } else {
            return largestnumber
          }
        }
        secondnumber = firstnumber
      }
      test = firstnumber * secondnumber
    }
  }
  
  def testP( int a ) {
    def teststring = (String)a
    def count = 0
    def firstdigit = teststring[count]
    def lastdigit = teststring[teststring.length() - 1]
    while( firstdigit.equals( lastdigit )) {
      if( count == Math.floor(teststring.length() / 2)) {
        return true
      }
      count++
      firstdigit = teststring[count]
      lastdigit = teststring[ teststring.length() - count - 1 ]
    }
    return false
  }
  
  def pow( int a ) {
    def total = 1
    def count = 0
    while( count < a ) {
      total *= 10
      count++
    }
    return total
  }
}
