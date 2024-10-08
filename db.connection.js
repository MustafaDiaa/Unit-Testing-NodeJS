import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { DB_NAME, DB_HOST } = process.env;
const URL = `${DB_HOST}/${DB_NAME}`;

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Successfully connected to the database: ${DB_NAME}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw new Error(
      "Unable to connect to the database. Please check your connection settings."
    );
  }
};

export const closeDatabase = async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log("Database connection closed and data dropped.");
  } catch (error) {
    console.error("Error closing the database:", error.message);
    throw new Error("Failed to close the database connection.");
  }
};

export const clearDatabase = async () => {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }

    console.log("All collections cleared.");
  } catch (error) {
    console.error("Error clearing collections:", error.message);
    throw new Error("Failed to clear database collections.");
  }
};
