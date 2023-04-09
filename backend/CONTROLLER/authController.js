const bcrypt = require('bcrypt')
const User = require('../MODELS/User');
const jwt = require('jsonwebtoken');


let refreshTokenArr = [];

const authController = {
    ///VIEW
    viewRegisterUser: (req, res) => {
        res.render('register');
    },
    viewLoginUser: (req, res) => {
        res.render('login');
    },


    ///CHỨC NĂNG
    //Register
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //Create a new user
            const newUser = await new User({
                username: req.body.username,
                password: hashed,
            })

            //Save to db
            const user = await newUser.save();
            res.redirect('/auth/login')
        } catch (err) {
            return res.status(500).json("Username lơn hơn 6 kí tự và nhỏ hơn 20 kí tự, password lơn hơn 6 kí tự")
        }
    },

    //khởi tạo accessToken
    generateAccessToke: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        },
            "jwt_access_key",
            { expiresIn: "20s" }
        );
    },
    //khởi tạo refreshToken
    generateRefreshToke: (user) => {
        return jwt.sign({
            id: user.id,
            admin: user.admin,
        },
            "jwt_refresh_key",
            { expiresIn: "365d" }
        );
    },


    //Login
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json(`Không có user ${req.body.username}`)
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if (!validPassword) {
                return res.status(404).json('Sai mật khẩu');
            }
            if (user && validPassword) {
                const accessToken = authController.generateAccessToke(user);
                const refreshToken = authController.generateRefreshToke(user);
                refreshTokenArr.push(refreshToken);
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                })
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                })
                const { password, ...other } = user._doc;
                // res.status(200).json({ ...other, accessToken });
                res.redirect('/book')
            }
        } catch (err) {
            return res.status(500).json({ err })
        }
    },
    requestRefreshToken: (req, res, next) => {
        //Lấy refreshToken từ user
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            // return res.status(401).json("Not authenticated!!!")
            res.redirect('/')
        }
        if (!refreshTokenArr.includes(refreshToken)) {
            // return res.status(403).json("Not valid!!!");
            res.redirect('/')
        }
        jwt.verify(refreshToken, 'jwt_refresh_key', (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokenArr = refreshTokenArr.filter((token) => {
                token !== refreshToken
            })
            // Tạo token mới
            const newAccessToken = authController.generateAccessToke(user);
            const newRefreshToken = authController.generateRefreshToke(user);
            refreshTokenArr.push(newRefreshToken);
            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            // res.status(200).json({ accessToken: newAccessToken });
            next();
        })
    },

    userLogout: async (req, res) => {
        res.clearCookie("refreshToken");
        refreshTokenArr = refreshTokenArr.filter(token => token !== req.cookies.refreshToken);
        // return res.status(200).json("Logouted!!!")
        res.redirect('/')
    },
}



module.exports = authController;