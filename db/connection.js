const { MongoClient } = require("mongodb");
const dotenv = require("dotenv").config();

const connectionString = process.env.MONGODB_CONNECTION_STRING;
const client = new MongoClient(connectionString, {
    useNewUrlParser: false,
    useUnifiedTopology: true,
});

let dbConnection;
let dbName = process.env.MONGODB_DB_NAME;

module.exports = {
    connectToServer: function (callback) {
        client.connect(function (err, db) {
            if (err || !db) {
                return callback(err);
            }

            dbConnection = db.db(dbName);
            console.log('Berhasil menghubungkan ke database');

            return callback();
        });
    },
    getDb: function () {
        return dbConnection;
    }
};