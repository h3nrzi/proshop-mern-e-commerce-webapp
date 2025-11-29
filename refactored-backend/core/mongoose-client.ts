import mongoose from "mongoose";
import { Logger } from "./services";

const logger = new Logger();
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectMongo(uri?: string): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = uri ?? process.env.MONGO_URI ?? "mongodb://localhost:27017/app";

  connectionPromise = mongoose
    .connect(mongoUri)
    .then((conn) => {
      logger.info("Connected to MongoDB");
      return conn;
    })
    .catch((error) => {
      logger.error("Failed to connect to MongoDB", { error: (error as Error).message });
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
}

export function getMongoConnection() {
  return mongoose.connection;
}

export function disconnectMongo(): Promise<void> {
  return mongoose.disconnect();
}
