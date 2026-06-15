import dns from "node:dns";
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const DNS_SERVERS = ["8.8.8.8", "1.1.1.1"];

const getMongoUri = () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from .env");
  }

  const mongoUri = new URL(process.env.MONGODB_URI);
  mongoUri.pathname = `/${DB_NAME}`;

  return mongoUri.toString();
};

const connectDB = async () => {
  try {
    console.log("Trying to connect...");

    dns.setServers(DNS_SERVERS);

    const connectionInstance = await mongoose.connect(getMongoUri(), {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      `MongoDB Connected! Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
