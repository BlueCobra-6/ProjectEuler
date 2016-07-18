import java.io.*; 
public class Main { 
  public static void main(String[] args) { 
    println new largestAdjacentProduct().decide(13, 2345678234567809876543) 
  } 
} 

class largestAdjacentProduct {
  BigInteger largestProduct = 0
  def decide( int a, BigInteger b ) {
    BigInteger firstdigit = 0
    BigInteger lastdigit = a
    String number = (String)b
    String shortnumber
    while( lastdigit < number.length() + 1 ) {
      shortnumber = number.substring( firstdigit, lastdigit )
      checkLargest( calculateProductofArray( getIntegers( shortnumber)))
      lastdigit++
      firstdigit++
    }
    println largestProduct
  }
  
  def getIntegers( String b ) {
    def integers = new Integer[ b.length() ]
    for ( int i; i < b.length(); i++ ) {
      integers[i] = Integer.parseInt(b[i])
    }
    return integers
  }
  
  def calculateProductofArray( Integer[] a ) {
    BigInteger product = 1
    for( int i = 0; i < a.size(); i++ ) {
      product *= (BigInteger)a[i]
    }
    return product
  }
  
  def checkLargest( BigInteger a ) {
    if( a > largestProduct ) {
      largestProduct = a
    }
  }
}
