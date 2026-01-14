import { Router } from "express";
import { CartModel } from "../models/cart-model.js";

const router = new Router();

// POST /api/carts/ - Crear un carrito nuevo y vacío
router.post('/', async (req, res) => {
    try {
        const newCart = await CartModel.create({ products: [] });
        
        res.status(201).json({ 
            status: "success", 
            message: "Carrito creado con éxito",
            payload: newCart 
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// POST /api/carts/:cid/product/:pid agrega un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        // 1. Buscamos el carrito
        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        // 2. Verificamos si el producto ya existe en el carrito
        // Comparamos los IDs como strings para evitar errores de tipo
        const existingProduct = cart.products.find(p => 
            p.product.toString() === pid || (p.product._id && p.product._id.toString() === pid)
        );

        if (existingProduct) {
            // Caso A: El producto YA ESTÁ, entonces sumamos 1 a la cantidad
            existingProduct.quantity += 1;
        } else {
            // Caso B: El producto NO ESTÁ, lo agregamos al arreglo
            cart.products.push({ product: pid, quantity: 1 });
        }

        // 3. Importante: Marcar el array como modificado para que Mongoose guarde los cambios
        cart.markModified('products');
        await cart.save();

        res.json({ status: "success", message: "Carrito actualizado", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

//GET /api/carts/:cid - Traer carrito con productos completos
router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid);
        
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        
        res.json({ status: "success", payload: cart.products });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

// 2. DELETE api/carts/:cid/products/:pid 
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid);

        // Filtramos: dejamos todos los que NO coincidan con el pid
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
});

// 3. PUT api/carts/:cid - Actualizar carrito con un arreglo de productos [cite: 44]
router.put('/:cid', async (req, res) => {
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
});

// 4. PUT api/carts/:cid/products/:pid - Actualizar SÓLO la cantidad [cite: 45]
router.put('/:cid/products/:pid', async (req, res) => {
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
});

// 5. DELETE api/carts/:cid - Eliminar todos los productos del carrito (vaciar)
router.delete('/:cid', async (req, res) => {
    try {
        // AQUÍ ESTABA EL ERROR: faltaba extraer 'cid' de req.params
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
});

export default router;