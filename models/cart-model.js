import { Schema, model } from "mongoose";

const CartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products" // Referencia clave para el populate [cite: 47]
            },
            quantity: { type: Number, default: 1 }
        }
    ]
});


CartSchema.pre('findOne', function() {
    this.populate('products.product');
});

export const CartModel = model("carts", CartSchema);