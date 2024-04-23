import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionDB = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connectionDB.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
