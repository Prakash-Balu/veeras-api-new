const { AuthenticationsSchema } = require("../schema");

class UserService {
    async updateUserData(_id, userUpdate) {
        try {
            return await AuthenticationsSchema.findByIdAndUpdate({ _id }, {
                ...userUpdate,
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new UserService();