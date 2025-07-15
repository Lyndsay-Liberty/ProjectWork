const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'custdb';

const client = new MongoClient(url);

let collection;

async function connect() {
  if (!collection) {
    await client.connect();
    const db = client.db(dbName);
    collection = db.collection('customers');
  }
}

async function getCustomers() {
  await connect();
  return collection.find().toArray();
}

module.exports = { getCustomers };
