/*const fs = require('fs')
fs.readFile('sample.json', 'utf-8', function(err, inpStr) {
            if(err) throw err
            console.log(inpStr)})
*/

function nullParser(data) {
  if (data.substr(0,4) === "null")
    var resData = data.slice(4)
    var resultArray = []
    resultArray.push(null, resData)
    return(resultArray)
}

function boolParser(data) {
  if(data.substr(0,4) === "true") {
    var resData = data.slice(4)
    var resultArray = []
    resultArray.push(true, resData)
    return(resultArray)
  }
  else if(data.substr(0,5) === "false") {
    var resData = data.slice(5)
    var resultArray = []
    resultArray.push(false, resData)
    return(resultArray)
  }
}

function commaParser(data) {
  if(data.startsWith(",")) {
    var resData = data.slice(1)
    return resData
  }
}

function colonParser(data) {
  var resData = data.slice(1)
  console.log(":", resData)
}

function numParser(data) {
  var parsedNumString = data.match(/-?\d+\.?\d*/).toString()
  var resData = data.slice(parsedNumString.length)
  var resultArray = []
  resultArray.push(parsedNumString, resData)
  return(resultArray)

}

function stringParser(data) {
  var parsedString = data.match(/[a-zA-Z]+/).toString()
  var i = data.slice(1).search(/"/)
  var resData = data.slice(i+2)
  var resultArray = []
  resultArray.push(parsedString, resData)
  return(resultArray)
}

function arrayParser(data) {
  parsedArray = []
  var arrayElement, remainingData
  while(data.charAt(0) != ']') {
    [arrayElement, remainingData] = valueParser(data)
    parsedArray.push(arrayElement)
    data = commaParser(remainingData)
  }
  console.log(parsedArray)
  //return ([parsedArray, data.slice(1)])
}

function valueParser(data) {
  var value, remainingData, resultArray = []
  if(data.charAt(0) == '"' ) {
    [value, remainingData] = stringParser(data.slice(1))
    resultArray.push(value, remainingData)
    return (resultArray)
  }
  else if(data.charAt(0) == /\d/) {
    [value, remainingData] = numParser(data)
    resultArray.push(value, remainingData)
    return (resultArray)
  }
  else if(data.charAt(0) == '[') {
      arrayParser(data.slice(1))
    }
  else if(data.charAt(0) == /true|false/) {
    [value, remainingData] = boolParser(data)
    resultArray.push(value, remainingData)
    return (resultArray)
  }
  else if(data.charAt(0) == null) {
    [value, remainingData] = nullParser(data)
    resultArray.push(value, remainingData)
    return (resultArray)
  }
  else if(data.charAt(0) == '{') {
    objectParser(data.slice(1))
  }
}

//function objectParser(data) {

//}
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin
})

rl.on('line', (line) => {
            valueParser(line)
            rl.close()})
