import { Router } from "express";
import {productManager} from '../managers/ProductManager.js';

export default (io) => {
    const router = new Router();

    router.get("/home", async (req, res) => {
        try{
            const productos = await productManager.getProducts();
            res.render("home", {productos});
        }
        catch(error){
            res.status(500).json({ error: 'Error interno del servidor al listar productos', details: error.message });
        }
    });

    router.get('/realTimeProducts', async(req, res) => {
        try{
            const productos = await productManager.getProducts();
            res.render('realTimeProducts', {productos});



            io.emit('real-time-products', productos);
        }   
        catch(error){
            res.status(500).json({ error: 'Error interno del servidor al listar productos', details: error.message })
        }
        
    });


    return router;
};