
const fs = require('fs');
const path = require('path');



// var parser = require("node-c-parser");

// const Parser = require('tree-sitter');
// const C = require('tree-sitter-c');

// const parser = new Parser();
// parser.setLanguage(C);
var analyzer = require("node-c-analyzer");
var treePrinter = require('tree-printer');

function callback(branch) {
    if (branch.type == 'declaration') {
        let string = branch.type + " " + branch.raw + " ";
        branch.tokens.forEach(token => {
            if (token.tokenClass == 'IDENTIFIER') {
                string += token.lexeme + " ";
            }
        })
        return string;
    }
    else {
        return '-'
    }
}

function parseMainAnalyzer() {
    var parser = analyzer.parser;
    var lexer = parser.lexer;
    lexer.cppUnit.clearPreprocessors("./main.c", function (err, codeText) {
        if (err) {
            console.log(err);
        }
        else {
            var tokens = lexer.lexUnit.tokenize(codeText);
            var parse_tree = parser.parse(tokens);
            var symbol_table = analyzer.statement_analyzer.get_statement_list(parse_tree);

            let options = {
                fields: {
                    children: 'body',
                    name: callback
                },
                autoPrint: true
            };
            let stablo = treePrinter(symbol_table, options);
            writeTree(symbol_table);


        }
    });
}

function readMain(fileName) {
    let code = fs.readFileSync(path.join(__dirname, `/${fileName}`));
    return code.toString();
}

function writeTree(tree) {
    fs.writeFile(path.join(__dirname, "/tree.json"), JSON.stringify(tree), (data) => { });
}

function executeMain(progName, args, input) {
    // exec('gcc ./main.c', (err, stdout, stderr) => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     }
    //     exec('./a.out', (err, stdout, stderr) => {
    //         if (err) {
    //             console.error(err);
    //             return;
    //         }
    //         console.log(stdout);
    //         console.log(stderr);
    //     }
    //     );
    //     console.log(stdout);
    //     console.log(stderr);
    // });

    exec(`gcc ${progName}`, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        let cExec = spawn('./a.out', args);

        if (input) {
            const inStream = new Readable();
            inStream.push(input);
            inStream.push(null);
            inStream.pipe(cExec.stdin);
        }
        cExec.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        cExec.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        cExec.on('close', (code) => {
            if (code != null){
            console.log(`child process exited with code ${code}`);
            }
            else {
                regexVarArrayDefinition(progName);
            }
        });

        console.log(stdout);
        console.log(stderr);
    });

    // readable.pipe(process.stdout)
    // const items = ['4', '4'];

    // let cExec = spawn('gcc', ['./main2.c']);
    // // items.forEach(item => 
    // //     { 
    // //         cExec.stdin.write(item); 
    // //     })


    // cExec.stdout.on('data', (data) => {
    //     console.log(`stdout: ${data}`);
    // });

    // cExec.stderr.on('data', (data) => {
    //     console.error(`stderr: ${data}`);
    // });

    // cExec.on('close', (code) => {
    //     console.log(`child process exited with code ${code}`);

    // });
}

function parseMain() {
    parser.lexer.cppUnit.clearPreprocessors("./main.c", function (err, codeText) {
        if (err) {
            // Error occured during preprocessor removal. Handle it.
            console.log(err);
        }
        else {
            // codeText variable contains preprocessor free code. Do something with it.

            var tokens = parser.lexer.lexUnit.tokenize(codeText);
            var parse_tree = parser.parse(tokens);
            fs.writeFile(path.join(__dirname, "/tree.json"), JSON.stringify(parse_tree), (data) => { });
            console.log(JSON.stringify(parse_tree));


        }
    });
}

function parseMainTreeSitter() {
    const parser = new Parser();
    parser.setLanguage(C);
    const sourceCode = readMain();
    const tree = parser.parse(sourceCode);

    console.log(tree.rootNode.children[0].children)

    fs.writeFile(path.join(__dirname, "/tree.json"), JSON.stringify(tree), (data) => { });
}

// parseMainAnalyzer();
// executeMain('main1.c', [6, 3, 2, 3, 2, 1]);


function regexVarDeclarations(fileName) {
    let code = readMain(fileName);

    let varTypes = `(int|char|long|double|float)`;

    // let regex = /int\s* \**\s*(?<varName>\w+)/g;
    let regex = new RegExp(`\\b${varTypes}\\s*(\\*)?\\s*(?<varName>\\w+)(\\s*\\[)?`, 'g');
    console.log(regex);

    let result = [...code.matchAll(regex)];

    let variables = extractVariables(result);
    variables.forEach(variable => {
        if (variable.name != 'main' && variable.name != 'argc' && variable.name != 'argv') {
            variable.newName = generateNewName(variable.type);
        }
        else {
            variable.newName = variable.name;
        }
    })
    console.log(variables);
    variables.forEach(variable => {
        let reg = new RegExp(`\\b${variable.name}\\b`, 'g');
        code = code.toString().replace(reg, variable.newName);
    })
    console.log(code);
    fs.writeFile(path.join(__dirname, `/${fileName}`), code, (data) => {
        console.log('Successfully wrote to file...');
    });
    executeMain(fileName, [6, 4, 2, 3, 2, 1, 1]);
}

function regexVarArrayDefinition(fileName) {
    let code = readMain(fileName);
    let regex = new RegExp(`\\b(unsigned)?\\s*(int|char|long|float|double)\\s*(\\w*)\\s*\\[(\\w*)?\\](\\[(\\w*)?\\])?\\s*\\=\\s*\\s*\\{([^\\}]*)\\s*\\}(\\s*\\,\\s*(\\w*)\\s*\\[(\\w*)?\\](\\[(\\w*)?\\])?\\s*\\=\\s*\\s*\\{([^\\}]*)\\s*\\})*`, 'g');
    let result = [...code.matchAll(regex)];
    let variables = analyzeArrayDefinition(result);
    console.log(variables);
    changeArrayValue(variables);
    code = swapArrayValues(variables, code);
    console.log(code);
    fs.writeFile(path.join(__dirname, `/${fileName}`), code, (data) => {
        console.log('Successfully wrote to file...');
    });
    executeMain(fileName);
}

function changeArrayValue(variables) {

    variables.forEach(variable => {

        let type = variable.type;
        if (type == 'int' || type == 'unsigned char') {
            let regex = new RegExp(`(0x[0-9abcdef]+)|(\\d+)`, 'g');
            let result = [...variable.values.matchAll(regex)];
            let newValue = '';
            for (let i = 0; i < result.length; i++) {
                let value = generateIntValue();
                if (i == 0 && result.length == 1 || i == result.length - 1) {
                    newValue += value;
                }
                else {
                    newValue += value + ', ';
                }

            }
            variable.newValue = newValue;

        }

    })

    console.log(variables);

}

function swapArrayValues(variables, code) {
    variables.forEach(variable => {
        let regex = new RegExp(`{\s*${variable.values}\s*}`);
        code = code.replace(regex,`{${variable.newValue}}`)
    })

    return code;
}

function generateIntValue() {
    let number = Math.random();
    if (number <= 0.5) {
        return Math.floor(Math.random() * Math.floor(21));
    }
    if (number <= 0.75) {
        return '0' + Math.floor(Math.random() * Math.floor(21)).toString(8);
    }
    if (number > 0.75) {
        return '0x' + Math.floor(Math.random() * Math.floor(30)).toString(16);
    }
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

function extractVariables(regexResult) {

    let variables = [];
    regexResult.forEach(result => {
        let varible = {
            type: result[1] + (!result[2] ? '' : result[2]) + (!result[4] ? '' : '*'),
            name: result[3],
            raw: result[0]
        }
        variables.push(varible);
    })
    return variables;
}

function generateNewName(type) {
    let text = "";
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let arrayNames = ['array', 'arr', 'niz', 'myArray', 'ptr', 'pointer'];
    if (type.includes('*')) {
        text = arrayNames[Math.floor(Math.random() * arrayNames.length)]
    }
    else {
        text += lower.charAt(Math.floor(Math.random() * lower.length));
    }

    return text;
}

// regexVarDeclarations('main1.c');
regexVarArrayDefinition('main.c');


