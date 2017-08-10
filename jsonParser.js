/*const fs = require('fs')
fs.readFile('sample.json', 'utf-8', function(err, inpStr) {
            if(err) throw err
            console.log(inpStr)})
*/

function nullParser(data) {
  if (data.substr(0,4) === "null")
    var resData = data.slice(4)
    console.log(null, resData)
}

function boolParser(data) {
  if(data.substr(0,4) === "true") {
    var resData = data.slice(4)
    console.log(true, resData)
  }
  else if(data.substr(0,5) === "false") {
    var resData = data.slice(5)
    console.log(false, resData)
  }
}

function commaParser(data) {
  if(data.startsWith(",")) {
    var resData = data.slice(1)
    console.log(",", resData)
  }
}

function colonParser(data) {
  var resData = data.slice(1)
  console.log(":", resData)
}

function numParser(data) {
  var parsedNumString = data.match(/-?\d+\.?\d*/).toString()
  var resData = data.slice(parsedNumString.length)
  console.log(parsedNumString, resData)

}

function stringParser(data) {
  var parsedString = data.match(/[a-zA-Z]+/).toString()
  var i = data.slice(1).search(/"/)
  var resData = data.slice(i+2)
  console.log(parsedString, resData)
}

function arrayParser (data) {
  
}
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin
})

rl.on('line', (line) => {
            numParser(line)
            rl.close()})
