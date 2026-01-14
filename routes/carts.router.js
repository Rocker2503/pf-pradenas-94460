import { Router } from "express";
import { addProductToCart, getCart, addCart, deleteProductFromCart, updateFullCart, updateQuantityProduct, emptyCart } from "../controllers/cart.controller.js";

const router = new Router();

// POST /api/carts/ - Crear un carrito nuevo y vacío
router.post('/', addCart);
// POST /api/carts/:cid/product/:pid - Agregar un producto a un carrito
router.post('/:cid/product/:pid', addProductToCart);
//GET /api/carts/:cid - Traer carrito con productos completos
router.get('/:cid', getCart);
// 2. DELETE api/carts/:cid/products/:pid 
router.delete('/:cid/products/:pid', deleteProductFromCart);
// 3. PUT api/carts/:cid - Actualizar carrito con un arreglo de productos
router.put('/:cid', updateFullCart);
// 4. PUT api/carts/:cid/products/:pid - Actualizar SÓLO la cantidad 
router.put('/:cid/products/:pid', updateQuantityProduct);
// 5. DELETE api/carts/:cid - Eliminar todos los productos del carrito (vaciar)
router.delete('/:cid', emptyCart);

export default router;