import java.io.*; 
public class Main { 
  public static void main(String[] args) { 
    println new SmallMultiple().function( 1, 20) 
  } 
} 

class SmallMultiple {
    def function( int low, int high ) {
        def total = 1
        def count = low
        while( count <= high ) {
            if( isPrime( count )) {
                total *= count
                //println count
                count++
            } else if( total % count == 0 ) {
                count++
            } else {
                total *= productOfMissingFactors( total, count )
            }
        }
        return total
    }
    def productOfMissingFactors( int total, int count ) {
        //println total
        //println count
        def product = 1
        def array = differingFactors( total, count )
        for( int i = 0; i < array.size(); i ++ ) {
            product *= array[i]
        }
        //println array
        return product
    }
    def differingFactors( int total, int count ) {
        def totalarray = primeFactorization( total )
        def countarray = primeFactorization( count )
        def finalarray = []
        while( true ) {
            if( totalarray.size() == 0 ) {
                finalarray += countarray
                break
            } else if( countarray.size() == 0 ) {
                break
            } else if( totalarray[0] < countarray[0] ) {
                totalarray.remove( 0 )
            } else if( totalarray[0] > countarray[0] ) {
                finalarray.add( countarray[0] )
                countarray.remove( 0 )
            } else if( totalarray[0] == countarray[0] ) {
                totalarray.remove( 0 )
                countarray.remove( 0 )
            } else {
                println "error"
                return
            }
        }
        return finalarray
    }
    def primeFactorization( int number ) {
        def array = []
        int current = number
        int count = 2
        while( current != 1 ) {
            if( current % count == 0 ) {
                current /= count
                array.add(count)
                continue
            }
            count++
        }
        return array
    }
    def isPrime( int a ) {
        int goal = a
        for( int i = 2; i < a; i++ ) {
            if( goal % i == 0 ) {
                return false
            }
        }
        return true
    }

}
