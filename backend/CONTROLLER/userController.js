const User = require('../MODELS/User')

const userController = {
    ///VIEW



    ///CHỨC NĂNG
    //GET ALL Users
    getAllUsers: async (req, res, next) => {
        try {
            const user = await User.find();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //DELETE USER
    deleteUser: async (req, res, next) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;