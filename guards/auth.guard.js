const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const JWT_KEY = "k_ztO47ZRp0ImJiCw1tYNqVmpDXFMHCX3Kg-z3sLDXPCOlG5HrI8GFRZgb5meYlgxF-os10FYer3GDoJbaJN7Wzvr0fTMR-nJNo0FH39D-ecgVXMYJ2i5k_8RHWIklA-u6Ml5vkvtEX_1H7oRawitg_AL9cOUkqpPjR2VLIB7GzDGxYTQf0fMs_pDjOVBy-4B32scvBp6dqw59LgrvGZyesdWSDFLbo69W-3m1PlzAZZPtsmJjxYSe_MGq_wJPm7lC8HsKvf5j7C_Bgm71ICWHydlhg3XVlHchaW09b7IHY4UKa_iHpnGFAkKhadynKf9PMmlFOYCP_fvuYriHNH5A";
        const decodedToken = jwt.verify(token, JWT_KEY);
        console.log("Authenticated " + decodedToken.username + " " + decodedToken.type);
        req.userId = decodedToken.id;
        next();
    } catch (error) {
        console.log("You are not authenticated!");
        res.status(401).json({ message: "You are not authenticated!" });
    }
};