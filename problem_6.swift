func differenceSumofSquaresandSquareofSum(input: Int) -> Int {
  return squareofSum(input: input) - sumofSquares(input: input)
}
  
func squareofSum(input: Int) -> Int {
  var total = 0
  for i in 1…input {
    total += i
  }
  return total * total
}

func sumofSquares(input: Int) -> Int {
  var total = 0
  for i in 1…input {
    total += (i * i )
  }
  return total
}

print(differenceSumofSquaresandSquareofSum(input: 100))
