// public firstName: string,
//         public lastName: string,
//         public email: string,
//         public username: string,
//         public password: string

const Model = require('sequelize').Model;
const Sequelize = require('sequelize');

const sequelize = require('../databaseConnection');



class User extends Model {};

User.init({
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING,
    },
    email:{
        type: Sequelize.STRING
    },
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    type: {
        type: Sequelize.STRING
    }
    

},{
    sequelize,
    modelName: 'user'
});

module.exports = User;