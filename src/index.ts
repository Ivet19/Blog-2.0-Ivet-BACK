import "dotenv/config";
import startServer from "./server/startServer.js";
import connectToDatabase from "./database/connectToDatabase.js";

const port = process.env.PORT || 4000;

await connectToDatabase(process.env.DATABASE_CONNECTION_STRING);

startServer(Number(port));
