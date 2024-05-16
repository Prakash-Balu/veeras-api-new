const jwt = require("jsonwebtoken");
require("dotenv").config();
const uuid = require("node-uuid");

class AuthService {
    async generateToken(data) {
        return await uuid.v4();
    }

    async generateRefreshToken(data) {
        return await uuid.v4();
    }
}

module.exports = new AuthService();