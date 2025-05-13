const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://komalgarg8952:Trigger123@cluster0.1ajbkzy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(url);

const dbName = "HelloWorld";
async function main() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("User");

    const data = {
        firstname:'komal',
        lastname:'garg',
        city:'delhi',
        phonenumber:'987654321'
    }
    const insertResult = await collection.insertOne(data)
    console.log("insertedResult",insertResult)
    const findResult = await collection.find().toArray();
    console.log("findResult",findResult)
  return "done.";
}


main()
 .then(console.log)
 .catch(console.error)
 .finally(() => client.close());
