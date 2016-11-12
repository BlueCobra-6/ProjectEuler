func function(input: Int ) -> Int {
  var total = 0
  var test = 1
  while(test < input ) {
    if( test % 5 == 0 ) {
      total += test
    } else if( test % 3 == 0 ) {
      total += test
    }
    test += 1
  }
  return total
}

print(function(input: 1000 ))
