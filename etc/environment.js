require('dotenv').config();

//initialize environemnt constants
var environment = {};

if (process.env.NODE_ENV == 'staging') {
    environment.RAZOR_PAY_KEY_ID="rzp_test_UJT02PVMbPZRkF"
    environment.RAZOR_PAY_KEY_SECRET="rdWdBnkz4tH34ForIl0zGt5A"
    environment.REDIRECT_URL = "https://veerasmissionhindi.com/dash.js"
} else if (process.env.NODE_ENV == 'production') {
    environment.RAZOR_PAY_KEY_ID="rzp_test_UJT02PVMbPZRkF"
    environment.RAZOR_PAY_KEY_SECRET="rdWdBnkz4tH34ForIl0zGt5A"
    environment.REDIRECT_URL = "https://veerasmissionhindi.com/dash.js"
} else {
    environment.RAZOR_PAY_KEY_ID="rzp_test_UJT02PVMbPZRkF"
    environment.RAZOR_PAY_KEY_SECRET="rdWdBnkz4tH34ForIl0zGt5A"
    environment.REDIRECT_URL = "http://localhost:4200"
}

module.exports = environment;