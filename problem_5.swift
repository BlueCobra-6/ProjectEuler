func smallMultiple(low: Int, high: Int) -> Int {
    var total = 1
    var count = low
    while count <= high {
        if isPrime(input: count) {
            total *= count
            //println count
            count += 1
        } else if total % count == 0  {
            count += 1
        } else {
            total *= productOfMissingFactors(total: total, count: count)
        }
    }
    return total
}
 
func productOfMissingFactors(total: Int, count: Int) -> Int {
    var product = 1
    var array = differingFactors(total: total, count: count)
    for i in 0..<array.count {
        product *= array[i]
    }
    return product
}
 
func differingFactors(total: Int, count: Int) -> [Int]{
    var totalarray = primeFactorization(number: total)
    var countarray = primeFactorization(number: count)
    var finalarray: [Int] = []
    while( true ) {
        if totalarray.count == 0  {
            finalarray += countarray
            break
        } else if countarray.count == 0 {
            break
        } else if totalarray[0] < countarray[0] {
            totalarray.remove(at: 0)
        } else if totalarray[0] > countarray[0] {
            finalarray.append(countarray[0])
            countarray.remove(at: 0)
        } else if totalarray[0] == countarray[0] {
            totalarray.remove(at: 0)
            countarray.remove(at: 0)
        } else {
            print("error")
            return []
        }
    }
    return finalarray
}
 
func primeFactorization(number: Int) -> [Int] {
    var array: [Int] = []
    var current = number
    var count = 2
    while current != 1 {
        if current % count == 0 {
            current /= count
            array.append(count)
            continue
        }
        count += 1
    }
    return array
}
 
func isPrime(input: Int) -> Bool {
    let goal = input
    if input < 2 { return false }
    if input < 4 { return true }
    for i in 2..<(input/2) {
        if goal % i == 0 {
            return false
        }
    }
    return true
}
 
print(smallMultiple(low: 1, high: 20))
