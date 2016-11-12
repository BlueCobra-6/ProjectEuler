func EvenFibonacci(input: Int) -> Int {
  var total = 0
  var firstnumber = 1
  var secondnumber = 1
  var placeholder = firstnumber
  while( secondnumber < input ) {
    if( secondnumber % 2 == 0 ) {
      total += secondnumber
    }
    placeholder = secondnumber
    secondnumber += firstnumber
    firstnumber = placeholder
  }
  return total
}

print(EvenFibonacci(input: 4000000))
