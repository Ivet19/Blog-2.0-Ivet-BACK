import "dotenv/config";
import startServer from "./server/startServer.js";
import connectToDatabase from "./database/connectToDatabase.js";

const port = process.env.PORT || 4000;

await connectToDatabase(
  "mongodb+srv://ivet19:Mondongo2025@mondongo.g5yiugk.mongodb.net/?retryWrites=true&w=majority&appName=Mondongo",
);

startServer(Number(port));
