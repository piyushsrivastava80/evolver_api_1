'use strict';
const Model_user = require('./../models/User');

const db = require('./../config/database');
const pg = require('pg');
const connection = db.connection
// const userSpecificDBConnection = db.userSpecificDBConnection

var NodeGeocoder = require('node-geocoder');
var geoip = require('geoip-lite');

var md5 = require('md5');

const fs = require('fs');
const jwt = require('jsonwebtoken');

const RSA_PUBLIC_KEY = fs.readFileSync('./config/public.key', 'utf8');
// const RSA_PUBLIC_KEY = fs.readFileSync('./../../../FMCG_Code/fmgc/api/config/public.key', 'utf8');

exports.checkIfAuthenticated = function (req, res, next) {
    // console.log("headers: ", req.headers.authorization);
    var token = req.headers.authorization;

    if (!token) return res.status(401).send({ auth: false, message: 'Please provide token.' });

    jwt.verify(token, RSA_PUBLIC_KEY, function (err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: err });
        } else {
            var decodedToken = jwt.decode(token);
            var currentUserDetail = JSON.parse(decodedToken.sub);
            req.currentUserDetail = currentUserDetail;
            next();
        }
    });
}

exports.login = function (req, res) {
    var credentials = { email: req.body.email, password: md5(req.body.password) };
    Model_user.index(credentials, function (err, userData) {
        res.send(userData);
    });
}

