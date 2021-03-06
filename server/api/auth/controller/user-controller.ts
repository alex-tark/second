"use strict";

import * as express from "express";
import * as jwt     from "jsonwebtoken";
import userDAO      from "../dao/user-dao";
import {error} from "protractor/built/logger";

const serverConst = require("@server/constants/server.json");

export class userController {

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
  static createUser(req:express.Request, res:express.Response) {
    let _user = req.body;

    userDAO
      ["createUser"](_user)
      .then(user => res.status(201).json(user))
      .catch(error => res.status(400).json({ success: false, message: error.message }));
  }

  static authentificate(req:express.Request, res:express.Response) {
    let _user = req.body;

    userDAO
      ["findByUsername"](_user.username)
      .then((user) => {
        if (!user) { return res.status(401).json({}) }

        user.comparePassword(req.body.password, (error, matches) => {
          if (matches && !error) {
            const token = jwt.sign({ user }, serverConst.secret);
            res.json({ success: true, message: 'Token granted', token });
          } else {
            res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.' });
          }
        });
      })
      .catch((error) => res.status(400).json(error));
  }

  static verify(headers) {
    if (headers && headers.authorization) {
      let split = headers.authorization.split(' ');
      if (split.length === 2) { return split[1]; }
      else { return null; }
    } else { return null; }
  }

  static getUser(req: express.Request, res: express.Response) {
    res.status(200).json({});
  }
}
