def function( int a ) {
    int currentstartingnumber = 2
    long currentnumber = 0
    int count = 0
    int higheststartingnumber = 1
    def map = [((long)1):(int)0]
    def newnumbers
    int j = 1
    for( int i = 1; i < 32; i++ ) {
        j <<= 2
        map.put((long)j, i)
    }
    while( currentstartingnumber < a ) {
        newnumbers = []
        currentnumber = currentstartingnumber
        count = 0
        while( !map.containsKey( currentnumber )) {
            count++
            newnumbers << currentnumber
            if(( currentnumber >> 1 << 1 ) == currentnumber ) {
                currentnumber = currentnumber >> 1
            } else {
                currentnumber = (long)3 * currentnumber + (long) 1
            }
        }
        for( int i = 0; i < newnumbers.size(); i++ ) {
            //if( newnumbers[i] > currentstartingnumber) {
            map.put(( newnumbers[i] ), ( map[currentnumber] + count - i ))
            //}
        }
        //println currentstartingnumber + " " + currentnumber
        if( currentnumber < currentstartingnumber || map.containsKey( currentnumber << 1 )) {
            /*if( map.containsKey( currentnumber << 1 )) {
                map.remove( newnumbers[i] >> 1 )
            }*/
            map.remove( currentnumber )
        }
        if( map[(long)currentstartingnumber] > map[(long)higheststartingnumber] ) {
            higheststartingnumber = currentstartingnumber
        }
        currentstartingnumber++
    }
    //println map
    return higheststartingnumber
}

def starttime = new Date()
println function(812500)
def endtime = new Date()
println endtime.time - starttime.time
