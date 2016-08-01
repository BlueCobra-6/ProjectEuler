import java.io.*; 
public class Main { 
  public static void main(String[] args) { 
    def starttime = new Date()
    println new triangleNumberDivisors().firstTNwithMinDivisors( 501 )
    def endtime = new Date()
    println endtime.time - starttime.time
  }
}

class triangleNumberDivisors {
    def triangleNumber
    def divisors
    def mindivisorgoal
    def firstTNwithMinDivisors( int input ) {
        mindivisorgoal = input
        divisors = 0
        def currentnum = 0
        def currenttotal = 0
        def tempdivisors
        while( divisors < mindivisorgoal ) {
            currentnum++
            currenttotal += currentnum
            if(( tempdivisors = countDivisors( currenttotal )) > divisors ) {
                triangleNumber = currenttotal
                divisors = tempdivisors
                println triangleNumber + ":" + divisors
            }
        }
        return currentnum + "th Triangle Number: " + triangleNumber + "\nDivisors: " + divisors
    }
    def countDivisors( int input ) {
        int maxdivisor = input
        def divisors = 0
        for( int i = 1; i <= maxdivisor; i++ ) {
            if( input % i == 0 ) {
                if( input / i > i ) {
                    divisors += 2
                } else if( input / i == i ) {
                    divisors += 1
                    break
                } else {
                    break
                }
            }
        }
        return divisors
    }
}
