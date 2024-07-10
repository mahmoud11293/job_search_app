import mongoose from "mongoose";

export const connection_db = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_DB_URI);
    console.log("connected to the database successfully");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
