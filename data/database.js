const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

//this variable will be available outside this file
let database;

async function connect(params) {
  const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
  database = client.db("blog"); //acess this exact database
}

function getDb() {
  if (!database) {
    throw { message: "Database connection not established!" };
  }

  return database;
}

module.exports = {
  connectToDatabase: connect,
  getDb: getDb,
};
