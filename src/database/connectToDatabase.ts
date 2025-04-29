import debug from "debug";
import mongoose from "mongoose";

const connectToDatabase = async (connectionString: string): Promise<void> => {
  try {
    await mongoose.connect(connectionString);

    mongoose.set("debug", true);
    debug("Connected to database");
  } catch (error) {
    debug(error);
    process.exit(1);
  }
};

export default connectToDatabase;
