"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var user_dao_1 = require("../dao/user-dao");
var serverConst = require("@server/constants/server.json");
var userController = /** @class */ (function () {
    function userController() {
    }
    /**
     * @api{POST} /auth/reg Registration
     * @apiVersion 0.0.1
     * @apiName  Register
     * @apiGroup OAuth
     *
     * @apiParam {String} username Unique user login name
     * @apiParam {String} password Custom user password
     *
     * @apiSuccess{User} user User data
     * @apiSuccessExample Success registration response example:
     * {
     *    username: "Vitalya332",
     *    password: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
     * }
     */
    userController.createUser = function (req, res) {
        var _user = req.body;
        user_dao_1.default["createUser"](_user)
            .then(function (user) { return res.status(201).json(user); })
            .catch(function (error) { return res.status(400).json({ success: false, message: error.message }); });
    };
    userController.authentificate = function (req, res) {
        var _user = req.body;
        user_dao_1.default["findByUsername"](_user.username)
            .then(function (user) {
            if (!user) {
                return res.status(401).json({});
            }
            user.comparePassword(req.body.password, function (error, matches) {
                if (matches && !error) {
                    var token = jwt.sign({ user: user }, serverConst.secret);
                    res.json({ success: true, message: 'Token granted', token: token });
                }
                else {
                    res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
                }
            });
        })
            .catch(function (error) { return res.status(400).json(error); });
    };
    userController.verify = function (headers) {
        if (headers && headers.authorization) {
            var split = headers.authorization.split(' ');
            if (split.length === 2) {
                return split[1];
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    userController.getUser = function (req, res) {
        res.status(200).json({});
    };
    return userController;
}());
exports.userController = userController;
//# sourceMappingURL=user-controller.js.map