const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {

    let user = req.body;
    user.type = 'student';

    // async generation of password hash
    bcrypt.hash(user.password, 8).then(
        async (hash) => {

            user.password = hash;
            try {
                //check if user with username and email already exists
                let dbUser = await User.findOne({
                    where: {
                        [Op.or]: [{ username: user.username }, { email: user.email }]
                    }
                })

                if (dbUser) {
                    res.status(403).json('User with this username or email already exists!');
                    console.log('User with this username or email already exists!');
                    return;
                }

                let newUser = await User.create(user);
                if (newUser) {
                    res.status(200).json("Successfully signed up!");
                }
                else {
                    res.status(500).json("Internal server error!");

                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json(err);

            }

        })


}

exports.login = async (req, res) => {
    let credentials = req.body;

    try {
        let dbUser = await User.findOne({ where: { username: credentials.username } });
        if (dbUser) {
            let hashedPassword = dbUser.password;
            let isValid = await bcrypt.compare(credentials.password, hashedPassword);
            if (isValid) {

                const tokenDuration = 3600 * 2; // 2h
                const JWT_KEY = "k_ztO47ZRp0ImJiCw1tYNqVmpDXFMHCX3Kg-z3sLDXPCOlG5HrI8GFRZgb5meYlgxF-os10FYer3GDoJbaJN7Wzvr0fTMR-nJNo0FH39D-ecgVXMYJ2i5k_8RHWIklA-u6Ml5vkvtEX_1H7oRawitg_AL9cOUkqpPjR2VLIB7GzDGxYTQf0fMs_pDjOVBy-4B32scvBp6dqw59LgrvGZyesdWSDFLbo69W-3m1PlzAZZPtsmJjxYSe_MGq_wJPm7lC8HsKvf5j7C_Bgm71ICWHydlhg3XVlHchaW09b7IHY4UKa_iHpnGFAkKhadynKf9PMmlFOYCP_fvuYriHNH5A";
                const token = jwt.sign({
                    id: dbUser.id,
                    username: dbUser.username,
                    type: dbUser.type
                }, JWT_KEY, { expiresIn: tokenDuration });
                res.status(200).json({
                    message: "Successfull login!",
                    token: token,
                    userID: dbUser.id,
                    expiresIn: tokenDuration,
                    type: dbUser.type
                })

            }
            else {
                res.status(401).json("User don't exists with given credentials!");

            }
        }
        else {
            res.status(401).json("User don't exists with given credentials!");
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

