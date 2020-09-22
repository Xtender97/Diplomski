const path = require('path');
const fs = require('fs');
const { execute, analyzer } = require('../codeRunnerFunctions');

exports.runCode = (req, res) => {
    let code = req.body.code;
console.log(code);
    let fileName = 'main.c'
    fs.writeFile(path.join(__dirname, fileName), code, () => {
        execute('controllers/' + fileName, res);
    })



}

exports.analyzeCode = (req, res) => {

    let code = req.body.code;
    let variables = analyzer(code);
    res.status(200).json(variables);

}