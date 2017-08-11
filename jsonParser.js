function nullParser(data) {
  var resData = data.slice(4)
  return([null, resData])
}

function boolParser(data) {
  if(data.substr(0,4) === "true") {
    var resData = data.slice(4)
    return([true, resData])
  }
  else if(data.substr(0,5) === "false") {
    var resData = data.slice(5)
    return([false, resData])
  }
}

function commaParser(data) {
  if(data.startsWith(',')) {
    var resData = data.slice(1)
    return resData
  }
  else {
    return data
  }
}

function colonParser(data) {
  if(data.startsWith(':')) {
    var resData = data.slice(1)
    return resData
  }
}

function spaceParser(data) {
    data = data.replace(/\s/g, '')
    //console.log(data)
    return data
}

function numParser(data) {
  //console.log(data)
  var parsedNum = (/[+-]?\d+\.?[eE]?[+-]?\d*/).exec(data).toString()
  //console.log(parsedNum);
  if(parsedNum != null) {
    var resData = data.slice(parsedNum.length)
    return([parsedNum, resData])
  }
}

function stringParser(data) {
  var parsedString = data.match(/[a-zA-Z0-9\:\/\.\-\\]+/).toString()
  var i = data.slice(1).search(/"/)
  var resData = data.slice(i+2)
  //console.log(parsedString);
  return([parsedString, resData])
}

function arrayParser(data) {
  var parsedArray = []
  //if()
  while(data.charAt(0) != ']') {
    var result = valueParser(data)
    parsedArray.push(result[0])
    data = result[1]
    data = commaParser(result[1])
  }
  //console.log(parsedArray)
  return ([parsedArray, data.slice(1)])
}

function objectParser(data) {
  var property, value, parsedObject = {}
  while(data.charAt(0) != '}') {
    var temp = valueParser(data)
    //console.log("here",temp)
    property = temp[0]
    data = colonParser(temp[1])
    temp = valueParser(data)
    value = temp[0]
    data = commaParser(temp[1])
    parsedObject[property] = value
    //console.log(parsedObject, data)
  }
  //console.log(parsedObject)
  return ([parsedObject, data.slice(1)])
}

function valueParser(data) {
  var resultArray = []
  if(data.charAt(0) == '{') {
    var parsedObject = objectParser(data.slice(1))
    //console.log("after objparser");
    return parsedObject
  }
  else if(data.charAt(0) == '[') {
    var parsedArray = arrayParser(data.slice(1))
    return parsedArray
  }
  else if(data.charAt(0) == '"' ) {
    resultArray = stringParser(data.slice(1))
    return resultArray
  }
  else if(/[0-9\.+-]/.test(data.charAt(0))) {
    resultArray = numParser(data)
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

}

const filename = process.argv[2]
const fs = require('fs')
fs.readFile(filename, 'utf-8', function(err, inpStr) {
            if(err) throw err
            var data = spaceParser(inpStr)
            var opObj = valueParser(data)
            console.log(opObj[0])
          })
/*const readline = require('readline');
          const rl = readline.createInterface({
            input: process.stdin
          })

          rl.on('line', (line) => {
                      valueParser(line)
                      rl.close()})*/
