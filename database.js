import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const mongoPassword = process.env.MONGO_PASSWORD;
const clusterName = "cluster0"
const dbName = "whisperDB"
const connectionString = `mongodb+srv://admin:${mongoPassword}@${clusterName}.ruawe0b.mongodb.net/${dbName}?retryWrites=true&w=majority`;


async function connectDB() {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('connected DB');
  } catch(err) {
    console.log('failed to connect DB, error:' + err);
  }
}


export default connectDB
