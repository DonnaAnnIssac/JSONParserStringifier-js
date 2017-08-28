const filename = process.argv[2]
const fs = require('fs')
fs.readFile(filename, 'utf-8', function(err, inpStr) {
            if(err) throw err
            var opObj = valueParser(inpStr)
            console.log(opObj[0])
          })

function nullParser(data) {
  if(data.substr(0,4) == 'null') {
    let resData = data.slice(4)
    resData = spaceParser(resData)
    return([null, resData])
  }
  else {
    return null
  }
}

function boolParser(data) {
  let resData = null
  if(data.substr(0,4) === "true") {
    resData = data.slice(4)
    resData = spaceParser(resData)
    return([true, resData])
  }
  else if(data.substr(0,5) === "false") {
    resData = data.slice(5)
    resData = spaceParser(resData)
    return([false, resData])
  }
  else {
    return null
  }
}

function commaParser(data) {
  if(data.startsWith(',')) {
    data = data.slice(1)
  }
  return data
}

function colonParser(data) {
  if(data.startsWith(':')) {
    data = data.slice(1)
  }
  return data
}

function spaceParser(data) {
  if((/^(\s)+/).test(data)) {
    data = data.replace(/^(\s)+/, '')
  }
  return data
}

function numParser(data) {
  let parsedNum = (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/).exec(data)
  if(parsedNum) {
    parsedNum = parsedNum[0]
    let resData = data.slice(parsedNum.length)
    resData = spaceParser(resData)
    parsedNum = parseInt(parsedNum)
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
  let i = data.slice(1).indexOf('"')
  let parsedString = data.slice(1,i+1).toString()
  let resData = data.slice(i+2)
  resData = spaceParser(resData)
  return([parsedString, resData])
}

function arrayParser(data) {
  if (data[0] != '[') {
    return null
  }
  let parsedArray = []
  data = data.slice(1)
  while(data.charAt(0) != ']') {
    data = spaceParser(data)
    let result = valueParser(data)
    parsedArray.push(result[0])
    data = commaParser(result[1])
    data = spaceParser(data)
  }
  return ([parsedArray, data.slice(1)])
}

function objectParser(data) {
  if (data[0] != '{') {
    return null
  }
  let property, value, parsedObject = {}
  data = data.slice(1)
  while(data.charAt(0) != '}') {
    data = spaceParser(data)
    let temp = valueParser(data)
    property = temp[0]
    data = colonParser(temp[1])
    data = spaceParser(data)
    temp = valueParser(data)
    value = temp[0]
    data = commaParser(temp[1])
    data = spaceParser(data)
    parsedObject[property] = value
  }
  console.log(parsedObject);
  return ([parsedObject, data.slice(1)])
}

function valueParser(data) {
  let resultArray = []
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
}
