const path = require('path');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const { Readable, Writable } = require('stream');

exports.execute = function executeMain(progName, res, args, input) {
    exec(`gcc ${progName}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            res.status(200).json({

                stderr: err.toString()
            })
            return;
        }
        if (args) {
            args = convertStringArgsToArray(args);
        }
        else {
            args = null;
        }
        let cExec = spawn('./a.out', args);

        if (input) {
            const inStream = new Readable();
            inStream.push(input);
            inStream.push(null);
            inStream.pipe(cExec.stdin);
        }
        let out, error;
        cExec.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            out = data;
        });

        cExec.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            error = data;
        });

        cExec.on('close', (code) => {
            if (code != null) {
                console.log(`child process exited with code ${code}`);

            }
            else {
                // regexVarArrayDefinition(progName);
            }
            res.status(200).json({
                stdout: out.toString(),
                stderr: error ? error.toString() : error
            })
        });

        console.log(stdout);
        console.log(stderr);
    });

}

exports.testExecute = function executeMain(progName, args, input) {
    return new Promise((resolve, reject) =>{
        exec(`gcc ${progName} -o ${progName}.out`, (err, stdout, stderr) => {
            try{
            if (err) {
                console.error(err);
                resolve(null);
            }
            if (args) {
                args = convertStringArgsToArray(args);
            }
            else {
                args = null;
            }
            let cExec = spawn(`${progName}.out`, args);

    
            if (input) {
                const inStream = new Readable();
                inStream.push(input);
                inStream.push(null);
                inStream.pipe(cExec.stdin);
            }
            let out, error;
            cExec.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
                out = data;
            });
    
            cExec.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
                error = data;
            });
    
            cExec.on('close', (code) => {
                if (code != null) {
                    console.log(`child process exited with code ${code}`);
                    resolve({code:code, stdout: out});

                }
                else {
                    // regexVarArrayDefinition(progName);
                    resolve(null);
                }
               
    
            });
    
            console.log(stdout);
            console.log(stderr);}
            catch(err){
                console.log(err);
            }
        });
    });

    

}

function convertStringArgsToArray(args) {
    let array = args.split(' ');
    console.log(array);
    return array;
}

exports.argsDetected = function detectedArgumentUse(code) {
    let regex = new RegExp(`\\b(argc|argv)\\b`, 'g');
    let result = [...code.matchAll(regex)];
    if (result.length > 2) {
        return true;
    }
    else {
        return false;
    }
}

exports.inputDetected = function detectedInputUse(code) {
    let regex = new RegExp(`\\b(scanf|getchar)\\b`, 'g');
    let result = [...code.matchAll(regex)];
    if (result.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

exports.analyzer = function regexVarArrayDefinition(code) {
    let regex = new RegExp(`\\b(unsigned)?\\s*(int|char|long|float|double)\\s*(\\w*)\\s*\\[(\\w*)?\\](\\[(\\w*)?\\])?\\s*\\=\\s*\\s*\\{([^\\}]*)\\s*\\}(\\s*\\,\\s*(\\w*)\\s*\\[(\\w*)?\\](\\[(\\w*)?\\])?\\s*\\=\\s*\\s*\\{([^\\}]*)\\s*\\})*`, 'g');
    let result = [...code.matchAll(regex)];
    let variables = analyzeArrayDefinition(result);
    console.log(variables);

    let regex1 = new RegExp(`^\\s*(unsigned)?\\s*(int|char)\\s*(\\w+)\\s*=\\s*(0x\\d+|\\d+|'\\w'|"\\w+")([^;]*)`, 'gm');
    let result1 = [...code.matchAll(regex1)];
    let variables1 = analyzeVarDefinition(result1);
    variables = variables.concat(variables1);
    return variables;



}

function analyzeVarDefinition(regexResult) {
    let variables = [];
    regexResult.forEach(variable => {
        let obj = {
            type: (variable[1] ? variable[1] + " " : '') + variable[2],
            name: variable[3],
            values: variable[4],
            raw: variable[0],
            class: 'var'
        }
        variables.push(obj);
        if (variable[5]) {
            let regex = new RegExp(`(\\w*)\\s*=\\s*(0x\\d+|\\d+|'\\w'|"\\w+")`, 'g');
            let res = [...variable[5].matchAll(regex)];
            res.forEach(
                item => {
                    let obj = {
                        type: (variable[1] ? variable[1] + " " : '') + variable[2],
                        name: item[1],
                        values: item[2],
                        raw: item[0],
                        class: 'var'
                    }
                    variables.push(obj)
                }
            )
        }

    })

    return variables;

}


function analyzeArrayDefinition(regexResult) {
    let variables = [];
    regexResult.forEach(
        variable => {
            let obj = {
                type: (variable[1] ? variable[1] + " " : '') + variable[2],
                name: variable[3],
                values: variable[7],
                raw: variable[0],
                class: 'array'
            }
            variables.push(obj);

            if (variable[13]) {
                let obj2 = {
                    type: (variable[1] ? variable[1] + " " : '') + variable[2],
                    name: variable[9],
                    values: variable[13],
                    raw: variable[8],
                    class: 'array'

                }
                variables.push(obj2);

            }
        }
    )
    return variables;
}