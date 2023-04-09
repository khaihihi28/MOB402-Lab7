const jwt = require('jsonwebtoken');

const middlewareController = {
    //verify token
    verifyToken: (req, res, next) => {
        const token = req.cookies.accessToken;
        if (token) {
            const mainToken = `Bearer ${token}`;
            const accessToken = mainToken.split(' ')[1];
            jwt.verify(accessToken, 'jwt_access_key', (err, user) => {
                if (err) {
                    // return res.status(403).json('Token is not valid');
                    res.redirect('/')
                }
                req.user = user;
                next();
            })
        }
        else {
            // res.status(403).json('Not Authenticated');
            res.redirect('/')
        }
    },

    verifyTokenIsAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user.admin) {
                next();
            }
            else {
                res.status(403).json('Bạn không phải admin!!!');
            }
        });
    }
}

module.exports = middlewareController;