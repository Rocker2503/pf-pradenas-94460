const { Router } = require('express');

module.exports = (cartManager) => {
    const router = new Router();

    router.post('/', async(req, res) => {
        try{
            const cart = await cartManager.addCart();
            res.status(201).json(cart);
        }
        catch(error){
            res.status(500).json({ error: 'Error interno del servidor al crear carrito', details: error.message });
        }
    });

    router.post('/:cid/products/:pid', async(req, res) => {
        try{
            const cartId = parseInt(req.params.cid);
            const productId = parseInt(req.params.pid);

            if(isNaN(cartId) || isNaN(productId)){
                res.status(500).json({ error: `Error interno del servidor con los datos ingresados`});
            }
            const cart = await cartManager.addProductInCart(cartId, productId);

            res.status(200).json({ status: 'success', cart: cart});
        }
        catch(error){
            res.status(500).json({ error: `Error interno del servidor con los datos ingresados`, details: error.message});
        }
    });

    router.get('/:cid', async(req, res) => {     
        try{
            const cartId = parseInt(req.params.cid);

            if(isNaN(cartId)){
                res.status(500).json({ error: 'Error interno del servidor al buscar carrito' });
            }

            const cart = await cartManager.getCartById(cartId);
            if(cart){
                res.status(200).json(cart);
            }else{
                res.status(404).json({ error: `Carrito con ID ${cartId} no encontrado.` });
            }
        }
        catch(error){
            res.status(500).json({ error: 'Error interno del servidor al buscar carrito' });
        }
    });

    return router;
}