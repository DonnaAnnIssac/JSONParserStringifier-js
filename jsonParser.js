const filename = process.argv[2]
const fs = require('fs')
fs.readFile(filename, 'utf-8', function(err, inpStr) {
            if(err) throw err
            parseAndStringify(inpStr)
          })
function parseAndStringify(input) {
  const parsedResult = valueParser(input)
  console.log("Parsed result")
  console.log(parsedResult[0])
  console.log("Stringified result")
  const stringifiedResult = stringifier(parsedResult[0])
  console.log(stringifiedResult);
}
const nullParser = function(data) {
  if(data.substr(0,4) == 'null') {
    let resData = data.slice(4), spaceParsedData = null
    if((spaceParsedData = (resData)) != null)
      return([null, spaceParsedData[1]])
    else return ([null, resData])
  }
  return null
}

const boolParser = function(data) {
  let resData = null, spaceParsedData = null
  if(data.substr(0,4) === "true") {
    resData = data.slice(4)
    if((spaceParsedData = spaceParser(resData)) != null)
      return([true, spaceParsedData[1]])
    else return ([true, resData])
  }
  else if(data.substr(0,5) === "false") {
    resData = data.slice(5)
    if((spaceParsedData = spaceParser(resData)) != null)
      return([false, spaceParsedData[1]])
    else return ([false, resData])
  }
  return null
}

const commaParser = function(data) {
  if(data.startsWith(',')) {
    data = data.slice(1)
  }
  return data
}

const colonParser = function(data) {
  if(data.startsWith(':')) {
    data = data.slice(1)
  }
  return data
}

const spaceParser = function(data) {
  if((/^(\s)+/).test(data)) {
    data = data.replace(/^(\s)+/, '')
    return ([' ', data])
  }
  return null
}

const numParser = function(data) {
  let parsedNum = (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/).exec(data), spaceParsedData = null
  if(parsedNum) {
    parsedNum = parsedNum[0]
    let resData = data.slice(parsedNum.length)
    parsedNum = parseInt(parsedNum)
    if((spaceParsedData = spaceParser(resData)) != null)
        return([parsedNum, spaceParsedData[1]])
    else return ([parsedNum, resData])
  }
  return null
}

const stringParser = function(data) {
  if (data[0] != '"') {
    return null
  }
  let i = data.slice(1).indexOf('"'), spaceParsedData = null
  let parsedString = data.slice(1,i+1).toString()
  let resData = data.slice(i+2)
  if((spaceParsedData = spaceParser(resData)) != null)
    return ([parsedString, spaceParsedData[1]])
  return([parsedString, resData])
}

const arrayParser = function(data) {
  if (data[0] != '[') {
    return null
  }
  let parsedArray = [], result = null, spaceParsedData = null
  data = data.slice(1)
  while(data[0] != ']') {
    if((spaceParsedData = spaceParser(data)) != null)
      result = valueParser(spaceParsedData[1])
    else result = valueParser(data)
    parsedArray.push(result[0])
    data = commaParser(result[1])
    if((spaceParsedData = spaceParser(data)) != null)
      data = spaceParsedData[1]
  }
  return ([parsedArray, data.slice(1)])
}

const objectParser = function(data) {
  if (data[0] != '{') {
    return null
  }
  let property, value, parsedObject = {}, temp = null, spaceParsedData =  null
  data = data.slice(1)
  while(data[0] != '}') {
    if((spaceParsedData = spaceParser(data)) != null) {
      temp = valueParser(spaceParsedData[1])
    }
    else temp = valueParser(data)
    property = temp[0]
    data = colonParser(temp[1])
    if((spaceParsedData = spaceParser(data)) != null)
      data = spaceParsedData[1]
    temp = valueParser(data)
    value = temp[0]
    data = commaParser(temp[1])
    if((spaceParsedData = spaceParser(data)) != null)
      data = spaceParsedData[1]
    parsedObject[property] = value
  }
  return ([parsedObject, data.slice(1)])
}

function parserFactory(data) {
  const parsers = [nullParser, boolParser, numParser, stringParser, arrayParser, objectParser]
  let result = parsers.filter(function(parser) {
                        if(parser(data) != null) return parser
                      })
  return result
}
function valueParser(data) {
  let result = parserFactory(data)
  let resultArray = result[0](data)
  return resultArray
}

function stringifier(input) {
  let resultString = ""
  if(input == null) { //convert null to string
    return(resultString.concat("null"))
  }
  else if(input === (true || false)) { //convert bool to string
    return(resultString.concat(input))
  }
  else if(Number.isFinite(input) || Number.isInteger(input) || Number.isSafeInteger(input)) { //convert number to string
    return(resultString.concat(input))
  }
  else if(typeof(input) == "string"){ //convert string to string
    return(resultString.concat("'").concat(input).concat("'"))
  }
  else if (Array.isArray(input)) { //convert array to string
    resultString = resultString.concat("[")
    let tempString = ""
    for( let i = 0; i < input.length; i++) {
      tempString = tempString.concat(stringifier(input[i]))
      if(i != (input.length - 1))
        tempString = tempString.concat(", ")
    }
    resultString = resultString.concat(tempString)
    resultString = resultString.concat("]")
    return resultString
  }
  else {  //convert obj to string
    resultString = resultString.concat("{")
    let keys = Object.keys(input)
    let last = keys[keys.length-1]
    for (prop in input) {
      resultString = resultString.concat(stringifier(prop))
      resultString = resultString.concat(": ")
      let value = input[prop]
      resultString = resultString.concat(stringifier(value))
      if (prop != last)
        resultString = resultString.concat(", ")
    }
    resultString = resultString.concat("}")
    return resultString
  }
}
