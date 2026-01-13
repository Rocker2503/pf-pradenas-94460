import { connect } from "mongoose";

const MONGO_URL = process.env.MONGO_URI;

export const initMongo = async () => {
    try{
        await connect(MONGO_URL);
        console.log("Conexión exitosa a MongoDB Atlas");
    }
    catch(error){
        throw new Error(error);
    }
};