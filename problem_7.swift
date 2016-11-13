func isPrime(input: Int) -> Bool {
  let goal = input
  for i in 2..<input {
    if goal % i == 0 {
      return false
    }
  }
  return true
}

func calculatePrimeNumber(input: Int) -> Int {
  var count = 0
  var currentnumber = 1
  while( count < input ) {
    currentnumber += 1
    if isPrime(input: currentnumber) {
      count += 1
    }
  }
  return currentnumber
}

print(calculatePrimeNumber(input: 10001))
