function nullParser(data) {
  if(data.substr(0,4) == 'null') {
    var resData = data.slice(4)
    console.log("In null parser");
    return([null, resData])
  }
  else {
    return null
  }
}

function boolParser(data) {

  if(data.substr(0,4) === "true") {
    var resData = data.slice(4)
    console.log("In bool Parser");
    return([true, resData])
  }
  else if(data.substr(0,5) === "false") {
    var resData = data.slice(5)
    console.log("In bool Parser");
    return([false, resData])
  }
  else {
    return null
  }
}

function commaParser(data) {
  if(data.startsWith(',')) {
    var resData = data.slice(1)
    console.log("In comma parser");
    return ([',', resData])
  }
  else {
    return null
  }
}

function colonParser(data) {
  if(data.startsWith(':')) {
    var resData = data.slice(1)
    console.log("In colon parser");
    return ([':', resData])
  }
  else {
    return null
  }
}

function spaceParser(data) {
    data = data.replace(/\s/g, '')
    //console.log(data)
    return data
}

function numParser(data) {
  var parsedNum = (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/).exec(data)
  if(parsedNum) {
    parsedNum = parsedNum[0]
    console.log(parsedNum);
    var resData = data.slice(parsedNum.length)
    console.log(resData)
    console.log("In number parser");
    return([parsedNum, resData])
  }
  else {
    return null
  }
}

function stringParser(data) {
  if (data[0] != '"') {
    return null
  }
  var temp = data.slice(1)
  var i = temp.indexOf('"')
  var parsedString = data.slice(0,i+2)
  var resData = data.slice(i+3)
  console.log("In string parser");
  return([parsedString, resData])
}

function arrayParser(data) {
  if (data[0] != '[') {
    return null
  }
  console.log("In array parser");
  var parsedArray = []
  data = data.slice(1)
  while(data.charAt(0) != ']') {
    var result = valueParser(data)
    parsedArray.push(result[0])
    console.log(parsedArray);
    var temp = commaParser(result[1])
    data = temp[1]
    console.log(data);
  }
  //console.log(parsedArray)
  return ([parsedArray, data.slice(1)])
}

function objectParser(data) {
  if (data[0] != '{') {
    return null
  }
  console.log("In Object parser");
  var property, value, parsedObject = {}
  while(data.charAt(0) != '}') {
    var temp = valueParser(data)
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
  console.log("In value Parser")
  var resultArray = []
  if((resultArray = nullParser(data)) != null)
    return resultArray
  else if((resultArray = boolParser(data)) != null)
    return resultArray
  else if((resultArray = numParser(data)) != null)
    return resultArray
  else if((resultArray = stringParser(data)) != null)
    return resultArray
  else if((resultArray = arrayParser(data)) != null)
    return resultArray
  else if((resultArray = objectParser(data)) != null)
    return resultArray
  else 
    return null
}

const filename = process.argv[2]
const fs = require('fs')
fs.readFile(filename, 'utf-8', function(err, inpStr) {
            if(err) throw err
            var opObj = valueParser(inpStr)
            console.log(opObj[0])
          })
