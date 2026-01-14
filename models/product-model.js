import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, unique: true, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    status: { type: Boolean, default: true }
});

ProductSchema.plugin(mongoosePaginate);

export const ProductModel = model("products", ProductSchema);