import { Router } from "express";
import { ProductModel } from "../models/product-model.js";
import { CartModel } from "../models/cart-model.js";

export default (io) => {
    const router = new Router();

    router.get("/home", async (req, res) => {
        try{
            const { page = 1, limit = 5 } = req.query;
            const productos = await ProductModel.paginate({}, { page, limit, lean: true });

            res.render("home", {
                productos: productos.docs,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevPage: productos.prevPage,
                nextPage: productos.nextPage,
                currentPage: productos.page,
                totalPages: productos.totalPages
            });

        }catch(error){
            res.status(500).json({ error: 'Error interno del servidor al cargar los productos', details: error.message});
        }
    });

    router.get('/realTimeProducts', async(req, res) => {
        try{
            const productos = await ProductModel.find().lean();
            res.render('realTimeProducts', {productos});
            io.emit('real-time-products', productos);
        }   
        catch(error){
            res.status(500).json({ error: 'Error interno del servidor al listar productos', details: error.message })
        }
        
    });

    router.get('/carts/:cid', async(req, res) => {
        try {
            const { cid } = req.params;
            // El populate ya lo hace el middleware de tu CartModel
            const cart = await CartModel.findById(cid).lean();

            if (!cart) return res.status(404).render('error', { error: 'Carrito no encontrado' });

            res.render('cart', { 
                products: cart.products, 
                cartId: cid 
            });
        } catch (error) {
            res.status(500).render('error', { error: 'Error al cargar el carrito' });
        }
    });

    router.get('/products/:pid', async(req, res) => {
        try{
            const { pid } = req.params;
            const product = await ProductModel.findById(pid).lean();

            if(!product) return res.status(404).render('error', { error: 'Producto no encontrado'})

            res.render('product', {product})

        }catch(error){
            res.status(500).render('error', { error: 'Error al cargar el producto' });
        }
    });


    return router;
};