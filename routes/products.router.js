const { Router } = require('express');

module.exports = (productManager) => { 
    const router = Router();

    // GET /api/products/
    router.get('/', async (req, res) => {
        try {
            const products = await productManager.getProducts();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor al listar productos', details: error.message });
        }
    });

    // GET /api/products/:pid
    router.get('/:pid', async (req, res) => {
        const productId = parseInt(req.params.pid); 
        try {
            const product = await productManager.getProductById(productId);
            
            if (product) {
                res.status(200).json(product);
            } else {
                // HTTP 404 Not Found
                res.status(404).json({ error: `Producto con ID ${productId} no encontrado.` });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor al buscar producto' });
        }
    });

    router.post('/', async (req, res) => {
        try{
            const productData = req.body;
            
            if (!productData.title || typeof productData.price !== 'number' || !productData.code) {
                return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios o los tipos de datos son incorrectos.' });
            }
            const createdProduct = productManager.addProduct(productData);


            res.status(201).json({ status: 'success', data: createdProduct });
        }
        catch(error){
            if (error.message.includes('Faltan campos obligatorios')) {
                return res.status(400).json({ status: 'error', message: error.message });
            }
            res.status(500).json({ status: 'error', message: 'Error interno del servidor al crear producto', details: error.message });
        }
    });

    router.put('/:pid', async (req, res) => {
        const productId = parseInt(req.params.pid);
        const updates = req.body;

        if (isNaN(productId)) {
            return res.status(400).json({ status: 'error', message: 'El ID del producto debe ser un número válido.' });
        }

        try {
            const updatedProduct = await productManager.updateProduct(productId, updates);

            res.status(200).json({ status: 'success', message: `Producto con ID ${productId} actualizado.`, data: updatedProduct });

        } catch (error) {
            if (error.message.includes('no encontrado')) {
                 // HTTP 404 Not Found
                return res.status(404).json({ status: 'error', message: error.message });
            }
            // Error interno del servidor
            res.status(500).json({ status: 'error', message: 'Error interno del servidor al actualizar producto', details: error.message });
        }
    });

    router.delete('/:pid', async (req, res) => {
        const productId = parseInt(req.params.pid);

        if (isNaN(productId)) {
            return res.status(400).json({ status: 'error', message: 'El ID del producto debe ser un número válido.' });
        }

        try {
            await productManager.deleteProduct(productId);
            
            // HTTP 200 OK y confirmación de éxito
            res.status(200).json({ status: 'success', message: `Producto con ID ${productId} eliminado correctamente.` });
            
        } catch (error) {
            if (error.message.includes('no encontrado')) {
                // HTTP 404 Not Found
                return res.status(404).json({ status: 'error', message: error.message });
            }
            // Error interno del servidor
            res.status(500).json({ status: 'error', message: 'Error interno del servidor al eliminar producto', details: error.message });
        }
    });

    return router; 
};