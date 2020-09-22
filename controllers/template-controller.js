const path = require('path');
const fs = require('fs');
const { execute, analyzer, argsDetected, inputDetected} = require('../codeRunnerFunctions');
const Template = require('../models/templates')

exports.runCode = (req, res) => {
    let code = req.body.code;
    let args = req.body.args;
    let stdin = req.body.stdin;
    let fileName = 'main.c'
    if(argsDetected(code) && !args){
        res.status(501).json('Please insert arguments!!!');
        return;
    }
    if(inputDetected(code) && !stdin){
        res.status(501).json('Please insert input values!!!');
        return;
    }

    if(!argsDetected(code) && args){
        console.log(args);
        res.status(501).json('Use of arguments is not detected! Please delete arguments!!!');
        return;
    }

    if(!inputDetected(code) && stdin){
        res.status(501).json('Use of input values is not detected! Please delete input valuse!!!');
        return;
    }
    fs.writeFile(path.join(__dirname, fileName), code, () => {
        execute('controllers/' + fileName, res, args, stdin);
    })



}

exports.analyzeCode = (req, res) => {

    let code = req.body.code;
    let variables = analyzer(code);
    let useOfInput = inputDetected(code);
    let useOfArgs = argsDetected(code);
    res.status(200).json({variables: variables, useOfArgs: useOfArgs, useOfInput: useOfInput});

}


exports.saveTemplate = (req, res) => {
    let template = req.body;
    if(argsDetected(template.code) && !template.args){
        res.status(501).json('Please insert arguments!!!');
        return;
    }
    if(inputDetected(template.code) && !template.stdin){
        res.status(501).json('Please insert input values!!!');
        return;
    }

    if(!argsDetected(template.code) && template.args){
        console.log(args);
        res.status(501).json('Use of arguments is not detected! Please delete arguments!!!');
        return;
    }

    if(!inputDetected(template.code) && template.stdin){
        res.status(501).json('Use of input values is not detected! Please delete input valuse!!!');
        return;
    }
    console.log(template);
    template.varsCount = template.vars.length;
    template.vars = JSON.stringify(template.vars);
    template.argsCount = template.args?template.args.split(' ').length:0;
    template.stdinCount = template.stdin?template.stdin.split(' ').length:0;
    Template.create(template).then(
        data => {
            res.status(200).json('Successfully created template!');
        }
    )
}