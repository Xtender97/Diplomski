const Model = require('sequelize').Model;
const Sequelize = require('sequelize');

const sequelize = require('../databaseConnection');



class Template extends Model {};

Template.init({
    code: {
        type: Sequelize.STRING(2500),
        allowNull: false
    },
    text: {
        type: Sequelize.STRING(1000),
        allowNull: false
    },
    argsCount:{
        type: Sequelize.INTEGER
    },
    args: {
        type: Sequelize.STRING
    },
    stdinCount: {
        type: Sequelize.INTEGER
    },
    stdin:{
        type: Sequelize.STRING
    },
    varsCount: {
        type: Sequelize.INTEGER
    },
    vars: {
        type: Sequelize.STRING(1000)
    },
    type: {
        type: Sequelize.STRING
    }
    

},{
    sequelize,
    modelName: 'template'
});

module.exports = Template;
    
