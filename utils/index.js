const constants = require("../configs/constants");
const CODE_NEW = constants.codeNew;
const MSG = constants.text;

module.exports = {
    sendResponseNew: function (req, res, code, message, data) {
        code = typeof code === "undefined" ? "OK" : code;

        let resp = {
            meta: {
                code: CODE_NEW[code],
                message: MSG.en[message] || message,
                timestamp: new Date().toISOString(),
            },
            data,
        };

        res.status(CODE_NEW[code]).json(resp);
    },

    notifyErrorNew: function (req, res, code, message) {
        code = typeof code === "undefined" ? "OK" : code;
    
        console.log(message)
    
        res.status(CODE_NEW[code]).json({
          meta: {
            code: CODE_NEW[code],
            message: MSG.en[message] || message,
            timestamp: new Date().toISOString(),
          },
        });
      },

    sendErrorNew: function (req, res, code, msg) {
        return module.exports.notifyErrorNew(req, res, code, msg);
    },
}