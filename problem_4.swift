func largestPalindrome(input: Int) -> Int {
    var firstnumber = pow10(input: input) - 1
    var secondnumber = firstnumber
    var test = firstnumber * secondnumber
    var largestnumber = 0
    while( true ) {
        if testPalindrome(input: test) && test > largestnumber {
            largestnumber = test
        }
        secondnumber -= 1
        if secondnumber < pow10(input: input - 1) {
            firstnumber -= 1
            if firstnumber < pow10(input: input - 1) {
                if largestnumber == 0 {
                    print("No palindrome in this range")
                    return -1
                } else {
                    return largestnumber
                }
            }
            secondnumber = firstnumber
        }
        test = firstnumber * secondnumber
    }
}

func testPalindrome(input: Int) -> Bool {
    var teststring = String(input)
    var count = 0
    var firstIndex = teststring.startIndex
    var firstDigit = teststring[firstIndex]
    
    var lastIndex = teststring.index(teststring.endIndex, offsetBy: -1)
    var lastDigit = teststring[lastIndex]
    while firstDigit == lastDigit {
        if count == teststring.characters.count / 2 {
            print( input )
            return true
        }
        count += 1
        firstIndex = teststring.index(teststring.startIndex, offsetBy: count)
        lastIndex = teststring.index(teststring.endIndex, offsetBy: count * -1 - 1)
        firstDigit = teststring[firstIndex]
        lastDigit = teststring[lastIndex]
    }
    return false
}

func pow10(input: Int) -> Int {
    var total = 1
    for _ in 0..<input {
        total *= 10
    }
    return total
}

print(largestPalindrome(input: 3))
