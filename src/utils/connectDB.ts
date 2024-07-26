import mongoose from "mongoose";

const connectDB = async () => {
  let connected = false;

  try {
    if(mongoose.connection.readyState === 1){
      return mongoose.connection.asPromise();
    }
    console.log("Connected to MongoDB success");
    return await mongoose.connect(process.env.MONGODB_URI!)
    
  } catch (error) {
    console.log(error, "Connecting to MongoDB failed!!");
  }
}

export default connectDB