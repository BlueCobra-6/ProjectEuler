func largestPrimeFactor(input: Int ) -> Int {
  var count = 2
  var placeholder = input
  while( placeholder != count ) {
    if( placeholder % count == 0 ) {
      placeholder /= count
    } else {
      count += 1
    }
  }
  return count
}

print(largestPrimeFactor(input: 600851475143))
