const { MongoClient, ServerApiVersion } = require("mongodb");

async function connectToDatabase(CONNECTION_STRING) {
    try {
        const client = new MongoClient(CONNECTION_STRING, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        }
        );
        await client.connect();
    } catch (err) {
        throw new Error("Database Connection Failed!", err)
    }
}

module.exports = connectToDatabase;