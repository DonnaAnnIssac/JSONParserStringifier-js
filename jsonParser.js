const fs = require('fs')
fs.readFile('sample.json', 'utf-8', function(err, inpStr) {
            if(err) throw err
            valueParser(inpStr)})
const output = {}
function valueParser (inpStr) {
  const data = inpStr.split("\n")
  console.log(data)
  //if(data.startsWith("{") && data.endsWith("}"))

}
