import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
export const saltRounds = 10
dotenv.config();

const mongoPassword = process.env.MONGO_PASSWORD;
const clusterName = "cluster0";
const dbName = "whisperDB";
const connectionString = `mongodb+srv://admin:${mongoPassword}@${clusterName}.ruawe0b.mongodb.net/${dbName}?retryWrites=true&w=majority`;

export async function connectDB() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected DB");
  } catch (err) {
    console.log("failed to connect DB, error:" + err);
  }
}

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secretKey = process.env.ENCRYPTION_KEY

export async function hashPasswordWithSalt(password) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw err;
  }
}

export async function checkUser(password, passwordHash) {
  const match = await bcrypt.compare(password, passwordHash);

}



export const User = new mongoose.model("User", userSchema);
