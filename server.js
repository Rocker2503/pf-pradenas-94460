const express = require('express');
const app = express();
const PORT = 8080;

//Creando el ProductManager y CartManager para gestionar los datos
const ProductManager = require('./ProductManager.js');
const CartManager = require('./CartManager.js'); 

const productManager = new ProductManager('products.json');
const cartManager = new CartManager('carts.json', 'products.json'); 

//Routers
const productsRouter = require('./routes/products.router.js')(productManager);
const cartsRouter = require('./routes/carts.router.js')(cartManager);

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter); 
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});