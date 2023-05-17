'use strict';
const db = require('./../config/database');
const pg = require('pg');
const connection = db.connection
// const userSpecificDBConnection = db.userSpecificDBConnection
const jwt = require('jsonwebtoken');
const fs = require('fs');

const RSA_PRIVATE_KEY = fs.readFileSync('./config/private.key', 'utf8');
// const RSA_PRIVATE_KEY = fs.readFileSync('./../../../FMCG_Code/fmgc/api/config/private.key', 'utf8');

var jwtBearerToken = null;

exports.index = function (where, callback) {
  var jwtBearerToken = null;
  var status = 0;
  var expiresIn = null;
  var expireTimeUnit = 'second';
  var result = { user_name: null };

  connection.connect(function (err, client, done) {
    // console.log("SELECT * from testing.users WHERE email='" + where.email + "' AND passwd='" + where.password + "' AND deleted=0");
    var sqlQuery = "SELECT * from testing.users WHERE email='" + where.email + "' AND passwd='" + where.password + "' AND deleted=0";
    const query = client.query(new pg.Query(sqlQuery));

    query.on('row', (user) => {
      status = 1;
      expiresIn = 1440 * 60;   // in second (By Default)
      result = user;
      var payload = {
        algorithm: 'RS256',
        expiresIn: expiresIn,
        subject: JSON.stringify(result)
      }
      // console.log(payload);
      jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, payload);
    });

    query.on('end', (res) => {
      // pool shutdown
      callback(null, { status: status, user_name: result.user_name, user_id: result.user_id, idToken: jwtBearerToken, expiresAt: expiresIn, expireTimeUnit: expireTimeUnit });
    });

    query.on('error', (err) => {
      console.log('Database error!', err);
      status = 0;
    });

    done()
  });

}
