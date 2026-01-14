import { CartModel } from "../models/cart-model.js";

export const addProductToCart = async (req, res) => {
    try{
        const { cid, pid } = req.params;

        const cart = await CartModel.findById(cid);
        if(!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado"});

        //Verifica si existe el producto en el carrito
        const existingProduct = cart.products.find(p => p.product.toString() === pid);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();

        res.status(200).json({status: "success", message: "Producto agregado con exito"});

    }catch(error){
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getCart = async (req, res) => {
    try{
        const { cid } = req.params; 
        const cart = await CartModel.findById(cid).populate('products.product');

        if(!cart) return res.status(404).json({status: "error", message: "Carrito no encontrado"});

        res.json({ status: "success", payload: cart.products });
    }catch(error){
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const addCart = async (req, res) => {
    try{
        const newCart = await CartModel.create({ products: [] });

        res.status(201).json({ 
            status: "success", 
            message: "Carrito creado con éxito",
            payload: newCart 
        });
        
    }catch(error){
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid);

        const originalLength = cart.products.length;
        cart.products = cart.products.filter(p => p.product.toString() !== pid && p.product._id.toString() !== pid);

        if (cart.products.length === originalLength) {
            return res.status(404).json({ status: "error", message: "El producto no estaba en el carrito" });
        }

        await cart.save();
        res.json({ status: "success", message: "Producto eliminado del carrito" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateFullCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body; // Se espera un array: [{product: id, quantity: n}]
        
        const updatedCart = await CartModel.findByIdAndUpdate(
            cid, 
            { products }, 
            { new: true }
        );
        
        res.json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateQuantityProduct = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        // 1. Buscamos el carrito
        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        // 2. Buscamos el producto comparando los IDs convertidos a String
        // Usamos .product._id porque el populate ya lo convirtió en objeto
        const productIndex = cart.products.findIndex(p => {
            const productIdInCart = p.product._id ? p.product._id.toString() : p.product.toString();
            return productIdInCart === pid;
        });

        if (productIndex !== -1) {
            // 3. Si existe, actualizamos la cantidad
            cart.products[productIndex].quantity = quantity;
            
            // Avisamos a Mongoose que el array 'products' cambió
            cart.markModified('products'); 
            
            await cart.save();
            res.json({ status: "success", message: "Cantidad actualizada", payload: cart });
        } else {
            res.status(404).json({ status: "error", message: "El producto no está en el carrito" });
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const emptyCart = async (req, res) => {
    try {
        const { cid } = req.params; 

        const cart = await CartModel.findByIdAndUpdate(
            cid, 
            { products: [] }, 
            { new: true }
        );

        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.json({ 
            status: "success", 
            message: "Carrito vaciado con éxito", 
            payload: cart 
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};