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
    let randomizedTemplates = [];
    Template.findAll({ order: Sequelize.literal('rand()'), limit: 5 }).then(async (templates) => {
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
                while (testResult == null) {
                    console.log('while');
                    template = randomizeTemplate(template);
                    fs.writeFileSync(fileName, template.code);
                    testResult = await testExecute(fileName, template.newArgs, template.newStdin);
                    fs.unlinkSync(fileName);
                    fs.unlinkSync(fileName + ".out");
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
    // template = template.get({ plain: true });
    if (template.argsCount > 0) {
        template.newArgs = generateNewArgs(template.args);
        let regex = new RegExp(`${template.args.trim()}`,'g');
        template.text = template.text.replace(regex,template.newArgs);
    }
    if(template.stdinCount > 0){
        template.newStdin = generateNewArgs(template.stdin);
        let regex = new RegExp(`${template.stdin.trim()}`,'g');
        template.text = template.text.replace(regex,template.newStdin);
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
            newArgs.push(Math.floor(Math.random() * Math.floor(arg * 2)));
        }
    })

    return newArgs.join(' ');
}

function generateFalseAnwsers(correctAnwser) {

    let array = correctAnwser.split(' ');

    let anwsers = [correctAnwser];
    if (array.length > 1) {
        shuffleArray(array);
        anwsers.push(array.join(' '));
        let array1 = correctAnwser.split(' ');
        let array2 = [];
        array1.forEach(elem => {
            if (!isNaN(elem) && elem != '') {
                // is number 
                let randomNumber = Math.random();
                if (randomNumber <= 0.25) {
                    elem = +elem + 1; // MOZE DA SE ODUZME NEKI DRUGI RANDOM BROJ
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
                elem = +elem + 1; // MOZE DA SE ODUZME NEKI DRUGI RANDOM BROJ
            }
            else {

                elem = +elem - 1;

            }
            anwsers.push(elem);

            // i jos pokreni sa slicnim argumentima ili promenljivim
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