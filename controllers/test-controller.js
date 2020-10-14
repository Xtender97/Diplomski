const Template = require('../models/templates')
const Sequelize = require('sequelize');
const chance = require('chance').Chance();
const { testExecute } = require('../codeRunnerFunctions');
const path = require('path');
const fs = require('fs');


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

exports.getTest = (req, res) => {
    Template.findAll({ order: Sequelize.literal('rand()'), limit: 5}).then(async (templates) => {
        try {
            for (let index = 0; index < templates.length; index++) {
                template = templates[index];
                template = template.get({ plain: true });
                template = randomizeTemplate(template);
                let fileName = path.join(__dirname, "prog" + new Date().getTime() + ".c");
                fs.writeFileSync(fileName, template.code);
                let testResult = await testExecute(fileName, template.newArgs, template.newStdin);
                fs.unlinkSync(fileName);
                fs.unlinkSync(fileName + ".out");
                console.log(testResult);
                while (testResult == null || testResult.stdout == undefined) {
                    console.log('while');
                    template = randomizeTemplate(template);
                    console.log(template.code);
                    fs.writeFileSync(fileName, template.code);
                    testResult = await testExecute(fileName, template.newArgs, template.newStdin);
                    fs.unlinkSync(fileName);
                    fs.unlinkSync(fileName + ".out");
                    console.log(testResult);
                }
             
                template.correctAnwser = testResult.stdout.toString();
                template.anwsers = generateFalseAnwsers(template.correctAnwser);

            }
        }
        catch (err) {
            console.log(err);
        }




        res.status(200).json({ pitalice: templates });
    }).catch(err => {
        res.status(500).json("Internal server error!");
    });


}

function randomizeTemplate(template) {
    if (template.argsCount > 0) {
        template.newArgs = generateNewArgs(template.args);
        let regex = new RegExp(`${template.args.trim()}`, 'g');
        template.text = template.text.replace(regex, template.newArgs);
    }
    if (template.stdinCount > 0) {
        template.newStdin = generateNewArgs(template.stdin);
        let regex = new RegExp(`${template.stdin.trim()}`, 'g');
        template.text = template.text.replace(regex, template.newStdin);
    }

    if (template.varsCount > 0) {
        let vars = JSON.parse(template.vars);
        vars.forEach(variable => {
            if (variable.class == 'array') {
                changeVarValue(variable);
                template.code = swapVarValues(variable, template.code);
            }
            else {
                // ako je promenljiva obicna
                changeVarValue(variable);
                template.code = swapVarValues(variable, template.code)

            }
        })
        template.vars = JSON.stringify(vars);

    }

    return template;
}


function generateNewArgs(oldArgs) {
    let args = oldArgs.split(' ');
    let numberOfArgs = args.length;
    let newArgs = [];
    args.forEach(arg => {
        if (isNaN(arg)) {
            //onda je string
            newArgs.push(chance.word({ length: arg.length }));

        }
        else {

            newArgs.push(Math.floor(Math.random() * Math.floor(arg * 1.5)));

        }
    })

    return newArgs.join(' ');
}

function generateFalseAnwsers(correctAnwser) {

    correctAnwser = correctAnwser.trim();
    let array = correctAnwser.split(' ');

    let anwsers = [correctAnwser];
    if (array.length > 1) {
        if (array.length == 2) {
            // swap elems
            let lastChar = array[array.length - 1];
            array[array.length - 1] = array[array.length - 2];
            array[array.length - 2] = lastChar;
        } else {
            shuffleArray(array);
        }
        anwsers.push(array.join(' '));
        let array1 = correctAnwser.split(' ');
        let array2 = [];
        array1.forEach(elem => {
            if (!isNaN(elem) && elem != '') {
                // is number 
                let randomNumber = Math.random();
                if (randomNumber <= 0.25) {
                    elem = +elem + 1; 
                }
                else {
                    if (randomNumber > 0.25 && randomNumber < 0.50) {
                        elem = +elem - 1;
                    }
                }
                array2.push(elem);
            }
            else {
                // sta radit ako nije broj

                let charArray = elem.split('');
                shuffleArray(charArray);
                array2.push(charArray.join(''));

            }
        })
        anwsers.push(array2.join(" "));


    }
    else {

        //sta raditi ako je samo jedan element
        if (!isNaN(correctAnwser)) {
            // ako je BROJ
            let elem = correctAnwser;
            let randomNumber = Math.random();
            if (randomNumber <= 0.5) {
                elem = +elem + 1; 
            }
            else {

                elem = +elem - 1;

            }
            anwsers.push(elem);
            

            
        } else {

            //swap last to characters
            let array = correctAnwser.split('');
            let lastChar = array[array.length - 1];
            array[array.length - 1] = array[array.length - 2];
            array[array.length - 2] = lastChar;
            anwsers.push(array.join(''));
        }
        //uvek uradi shuffle
        let charArray = correctAnwser.split('');

        if (charArray.length > 1) {
            if (charArray.length == 2) {
                // swap elems
                let lastChar = charArray[charArray.length - 1];
                charArray[charArray.length - 1] = charArray[charArray.length - 2];
                charArray[charArray.length - 2] = lastChar;
            } else {
                shuffleArray(charArray);
            }
            let shuffledAnswer = charArray.join('');
            let cnt = 0;
            while (shuffledAnswer == correctAnwser) {
                console.log("shuff = correctAnwser");
                charArray = correctAnwser.split('');
                shuffleArray(charArray);
                shuffledAnswer = charArray.join('');
                cnt++;
                if(cnt == 1000){
                    break;
                }
            }
            anwsers.push(shuffledAnswer);
        }
        else {

            if (!isNaN(correctAnwser)) {
                // ako je BROJ
                let elem = correctAnwser;
                let randomNumber = Math.random();
                if (randomNumber <= 0.5) {
                    elem = +elem + 2; 
                }
                else {

                    elem = +elem - 2;

                }
                anwsers.push(elem);

            } else {
                
            }
        }
    }
    return anwsers;


}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function changeVarValue(variable) {

    let type = variable.type;
    if (type == 'int' || type == 'unsigned char' || type == 'unsigned int') {
        let regex = new RegExp(`(0x[0-9abcdef]+)|(\\d+)`, 'g');
        let result = [...variable.value.matchAll(regex)];
        let newValue = '';
        for (let i = 0; i < result.length; i++) {
            let value = generateIntValue(result[i][0]);
            if (i == 0 && result.length == 1 || i == result.length - 1) {
                newValue += value;
            }
            else {
                newValue += value + ', ';
            }

        }
        if (variable.newValue) {
            variable.oldValue = variable.newValue;
        }
        else {
            variable.oldValue = variable.value;
        }
        variable.newValue = newValue;


    }
    else {
        console.log(variable);
        let regex = new RegExp(`"\\w+"`, 'g'); 
        let result = [...variable.value.matchAll(regex)];
        let newValue = '';
        for (let i = 0; i < result.length; i++) {
            let value = chance.word({ length: result[i][0].length - 2 });
            if (i == 0 && result.length == 1 || i == result.length - 1) {
                newValue += `"${value}"`;
            }
            else {
                newValue += `"${value}", `;
            }

        }
        if (variable.newValue) {
            variable.oldValue = variable.newValue;
        }
        else {
            variable.oldValue = variable.value;
        }
        variable.newValue = newValue;
    }
}




function swapVarValues(variable, code) {
    if (variable.class == 'array') {
        let regex = new RegExp(`{\\s*${variable.oldValue}\\s*}`);
        code = code.replace(regex, `{${variable.newValue}}`)
    }
    else {
        let regex = new RegExp(`${variable.name}\\s*=\\s*${variable.oldValue}`);
        code = code.replace(regex, `${variable.name} = ${variable.newValue}`);

    }
    return code;

}



function generateIntValue(oldValue) {
    let number = Math.random();
    if (number <= 0.5) {
        return Math.floor(Math.random() * Math.floor(oldValue * 1.5));
    }
    if (number <= 0.75) {
        return '0' + Math.floor(Math.random() * Math.floor(oldValue * 1.5)).toString(8);
    }
    if (number > 0.75) {
        return '0x' + Math.floor(Math.random() * Math.floor(oldValue * 1.5)).toString(16);
    }
}