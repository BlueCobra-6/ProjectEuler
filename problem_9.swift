func pythagoreanTriplet(input: Int) -> Int {
  var a = 1
  var b = 2
  var c = input - a - b
  while( a*a + b*b != c*c ) {
    b += 1
    c -= 1
    if b >= c {
      a += 1
      b = a + 1
      c = input - a - b
    }
    if b > c {
            print("No Pythagorean Triplet")
      return "No Pythagorean Triplet"
    }
  }
  return a*b*c
}

print(pythagoreanTriplet(input: 1000))
