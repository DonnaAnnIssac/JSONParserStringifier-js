const filename = process.argv[2]
const fs = require('fs')

fs.readFile(filename, 'utf-8', function(err, inpStr) {
            if(err) throw err
            parseAndStringify(inpStr)
          })

const nullParser = function(data) {
  if(data.substr(0,4) == 'null')
    return (((spaceParsedData = spaceParser(data.slice(4))) != null) ? ([null, spaceParsedData[1]]) : ([null, data.slice(4)]))
  return null
}

const boolParser = function(data) {
  let resData, spaceParsedData
  if(data.substr(0,4) === "true")
    return (((spaceParsedData = spaceParser(data.slice(4))) != null) ? ([true, spaceParsedData[1]]) : ([true, data.slice(4)]))
  else if(data.substr(0,5) === "false")
    return (((spaceParsedData = spaceParser(data.slice(5))) != null) ? ([false, spaceParsedData[1]]) : ([false, data.slice(5)]))
  return null
}

const commaParser = function(data) {return ((data.startsWith(',')) ? ([',', data.replace(/[',']/, '')]) : null)}

const colonParser = function(data) {return((data.startsWith(':')) ? ([':', data.replace(/[':']?/, '')]) : null)}

const spaceParser = function(data) {return (((/^(\s)+/).test(data)) ? ([' ', data.replace(/^(\s)+/, '')]) : null)}

const numParser = function(data) {
  let parsedNum = (/^[-+]?[0-9]+(.[0-9]+([eE][-+]?[0-9]+)?)?/).exec(data), spaceParsedData
  if(parsedNum) {
    parsedNum = parsedNum[0]
    let resData = data.slice(parsedNum.length)
    parsedNum = parseInt(parsedNum)
    console.log(parsedNum);
    return (((spaceParsedData = spaceParser(resData)) != null) ? ([parsedNum, spaceParsedData[1]]) : ([parsedNum, resData]))
  }
  return null
}

const stringParser = function(data) {
  if (data[0] !== '"') return null
  data = data.replace(/"(\s)+/, '"')
  let i = data.search(/"(:|,|]|}|\\n)/)
  let parsedString = data.slice(1,i)
  let resData = data.slice(i+1)
  console.log(parsedString);
  return (((spaceParsedData = spaceParser(resData)) !== null) ? ([parsedString, spaceParsedData[1]]) : ([parsedString, resData]))
}

const arrayParser = function(data) {
  if (data[0] !== '[') return null
  let parsedArray = [], result, spaceParsedData, commaParsedData
  data = data.slice(1)
  while(data[0] !== ']') {
    result = ((spaceParsedData = spaceParser(data)) !== null) ? valueParser(spaceParsedData[1]) : valueParser(data)
    if(result == null) return result
    parsedArray.push(result[0])
    data = ((commaParsedData = commaParser(result[1])) !== null) ? commaParsedData[1] : result[1]
    data = ((spaceParsedData = spaceParser(data)) !== null) ? spaceParsedData[1] : data
  }
  console.log(parsedArray);
  return ([parsedArray, data.slice(1)])
}

const objectParser = function(data) {
  if (data[0] !== '{') return null
  data = data.slice(1)
  let property, value, parsedObject = {}, temp, spaceParsedData, colonParsedData, commaParsedData
  while(data[0] !== '}') {
    temp = ((spaceParsedData = spaceParser(data)) !== null) ? valueParser(spaceParsedData[1]) : valueParser(data)
    if(temp == null) return temp
    property = temp[0]
    data = ((colonParsedData = colonParser(temp[1])) !== null) ? colonParsedData[1] : temp[1]
    data = ((spaceParsedData = spaceParser(data)) !== null) ? spaceParsedData[1] : data
    temp = valueParser(data)
    if(temp == null) return temp
    value = temp[0]
    data = ((commaParsedData = commaParser(temp[1])) !== null) ? commaParsedData[1] : temp[1]
    data = ((spaceParsedData = spaceParser(data)) !== null) ? spaceParsedData[1] : data
    parsedObject[property] = value
  }
  console.log(parsedObject);
  return ([parsedObject, data.slice(1)])
}

function anyParserFactory(...parsers) {
  return function(input) {
    for(let i = 0; i < parsers.length; i++) {
      let result = parsers[i](input)
      if(result != null) return result
    }
  return null
  }
}

const valueParser = anyParserFactory(nullParser, boolParser, numParser, stringParser, arrayParser, objectParser)

function parseAndStringify(input) {
  if(input[0] !== '{' && input[0] !== '[') {console.log("Invalid JSON"); return}
  const parsedResult = valueParser(input)
  console.log("Parsed result")
  let result =(parsedResult != null) ? parsedResult[0] : "Invalid"
  console.log(result)
  console.log("Stringified result")
  if(parsedResult != null) {
  const stringifiedResult = stringifier(parsedResult[0])
  result = (stringifiedResult != null) ? stringifiedResult : "Invalid"
  console.log(result)}
  else console.log("Invalid");
}

function stringifier(input) {
  let resultString = ""
  if(input == null) {
    return(resultString.concat("null"))
  }
  else if(input === true || input === false) {
    return(resultString.concat(input))
  }
  else if(Number.isFinite(input) || Number.isInteger(input) || Number.isSafeInteger(input)) { //convert number to string
    return(resultString.concat(input))
  }
  else if(typeof(input) == "string"){
    return(resultString.concat("'").concat(input).concat("'"))
  }
  else if (Array.isArray(input)) {
    resultString = resultString.concat("[")
    let tempString = ""
    for( let i = 0; i < input.length; i++) {
      tempString = tempString.concat(stringifier(input[i]))
      tempString = (i != (input.length - 1)) ? tempString.concat(", ") : tempString
    }
    return (resultString.concat(tempString).concat("]"))
  }
  else {
    resultString = resultString.concat("{")
    let keys = Object.keys(input)
    let first = keys[0]
    for (prop in input) {
      resultString = (prop != first) ? resultString.concat(", ").concat(stringifier(prop)).concat(": ") : resultString.concat(stringifier(prop)).concat(": ")
      resultString = resultString.concat(stringifier(input[prop]))
    }
    return resultString.concat("}")
  }
}
