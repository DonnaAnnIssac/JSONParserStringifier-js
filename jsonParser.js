/*const fs = require('fs')
fs.readFile('sample.json', 'utf-8', function(err, inpStr) {
            if(err) throw err
            console.log(inpStr)})
*/

function nullParser(data) {
  if (data.substr(0,4) === "null")
    var resData = data.slice(4)
    //var resultArray = []
    //resultArray.push(null, resData)
    //console.log(resultArray[0]);
    return([null, resData])
}

function boolParser(data) {
  if(data.substr(0,4) === "true") {
    var resData = data.slice(4)
    //var resultArray = []
    //resultArray.push(true, resData)
    //console.log(resultArray);
    return([true, resData])
  }
  else if(data.substr(0,5) === "false") {
    var resData = data.slice(5)
    //var resultArray = []
    //resultArray.push(false, resData)
    //console.log(resultArray);
    return([false, resData])
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
  return resData
}

function numParser(data) {
  var parsedNumString = data.match(/-?\d+\.?\d*/).toString()
  var index = data.indexOf(",")
  var resData = data.slice(index)
  //var resultArray = []
  //resultArray.push(parsedNumString, resData)
  //console.log("In num",resultArray)
  return([parsedNumString, resData])

}

function stringParser(data) {
  var parsedString = data.match(/[a-zA-Z]+/).toString()
  var i = data.slice(1).search(/"/)
  var resData = data.slice(i+2)
  //var resultArray = []
  //resultArray.push(parsedString, resData)
  //console.log(resultArray);
  return([parsedString, resData])
}

function arrayParser(data) {
  var parsedArray = []
  while(data.charAt(0) != ']') {
    console.log("hey", data.charAt(0));
    var result = valueParser(data)
    console.log("In Arr after val", result)
    parsedArray.push(result[0])
    console.log(parsedArray);
    data = result[1]
    if(data.startsWith(','))
    data = commaParser(result[1])
    console.log(data);
  }
  //console.log(parsedArray)
  return ([parsedArray, data.slice(1)])
}

function valueParser(data) {
  var resultArray = []
  if(data.charAt(0) == '[') {
    console.log("Before array in val", data.slice(1));
    var parsedArray = arrayParser(data.slice(1))
    console.log("After array in val", parsedArray);
    return parsedArray
  }
  else if(data.charAt(0) == '"' ) {
    resultArray = stringParser(data.slice(1))
    return resultArray
  }
  else if(/[0-9]/.test(data.charAt(0))) {
    resultArray = numParser(data)
    console.log("During array after num",resultArray);
    return resultArray
  }
  else if(/t|f/.test(data.charAt(0))) {
    resultArray = boolParser(data)
    return resultArray
  }
  else if(data.substr(0,4) == 'null') {
    resultArray = nullParser(data)
    return resultArray
  }
  else if(data.charAt(0) == '{') {
    console.log("hey");
    objectParser(data.slice(1))
  }
}

function objectParser(data) {
  var property, value, parsedObject = {}
  while(data.charAt(0 != '}')) {
    var temp = valueParser(data)

    property = temp[0]
    data = colonParser(temp[1])
    temp = valueParser(data)
    value = temp[0]
    data = temp[1]
    if(data.startsWith(','))
    data = commaParser(temp[1])
    parsedObject[property] = value
    console.log(parsedObject);
  }
  console.log(parsedObject);
  return parsedObject
}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin
})

rl.on('line', (line) => {
            valueParser(line)
            rl.close()})
