const pg = require('pg');

const connection = new pg.Pool({// apllication database connection
    // const connection = new pg.Client({// apllication database connection
    user: 'tracker',
    host: 'bxl-db.c6ypiqv0awyo.us-east-1.rds.amazonaws.com',
    database: 'innotracker',
    password: 'fghjk%$^&hgjk',
    port: 5432,
    tls: { rejectUnauthorized: false },
    ssl: false
});
connection.connect(function (err) {
    if (!err) {
        console.log("Evolver Database is connected ... ");
    } else {
        console.log('Evolver DB Connection Error ! ' + err);
    }
});

module.exports = {
    connection: connection,
    // connectionAI: connectionAI,
    // userSpecificDBConnection: userSpecificDBConnection,
}
