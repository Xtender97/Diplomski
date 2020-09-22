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
                stderr: error?error.toString():error
            })
        });

        console.log(stdout);
        console.log(stderr);
    });

}

exports.analyzer = function regexVarArrayDefinition(code) {
    let regex = new RegExp(`\\b(unsigned)?\\s*(int|char|long|float|double)\\s*(\\w*)\\s*\\[(\\w*)?\\](\\[(\\w*)?\\])?\\s*\\=\\s*\\s*\\{([^\\}]*)\\s*\\}(\\s*\\,\\s*(\\w*)\\s*\\[(\\w*)?\\](\\[(\\w*)?\\])?\\s*\\=\\s*\\s*\\{([^\\}]*)\\s*\\})*`, 'g');
    let result = [...code.matchAll(regex)];
    let variables = analyzeArrayDefinition(result);
    console.log(variables);
    return variables;
    // changeArrayValue(variables);
    // code = swapArrayValues(variables, code);
    // console.log(code);
    // fs.writeFile(path.join(__dirname, `/${fileName}`), code, (data) => {
    //     console.log('Successfully wrote to file...');
    // });
    // executeMain(fileName);


}


function analyzeArrayDefinition(regexResult) {
    let variables = [];
    regexResult.forEach(
        variable => {
            let obj = {
                type: (variable[1] ? variable[1] + " " : '') + variable[2],
                name: variable[3],
                values: variable[7],
                raw: variable[0]
            }
            variables.push(obj);

            if (variable[13]) {
                let obj2 = {
                    type: (variable[1] ? variable[1] + " " : '') + variable[2],
                    name: variable[9],
                    values: variable[13],
                    raw: variable[8]
                }
                variables.push(obj2);

            }
        }
    )
    return variables;
}