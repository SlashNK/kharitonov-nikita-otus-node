import mongoose from "mongoose";

export async function connectToMongoDB(
  address: string = "mongodb://127.0.0.1:27017/workout-logger"
): Promise<void> {
  try {
    await mongoose.connect(address);
    console.log("Connected to MongoDB Server successfully");
  } catch (error) {
    console.error(`Connection to MongoDB failed with error ${error}`);
    process.exit(1);
  }
}

export async function disconnectFromMongoDB(): Promise<void> {
  return mongoose.connection.close(false);
}
