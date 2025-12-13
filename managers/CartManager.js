import { promises } from 'node:fs'; 
import { productManager } from './ProductManager.js';

class CartManager{
    constructor(path, productFilePath){
        this.path = path;
        this.carts = [];
    }

    #loadCarts = async() => {
        try{
            const data = await promises.readFile(this.path, 'utf-8');
            this.carts = data ? JSON.parse(data) : [];
        }
        catch(error){
            if (error.code === 'ENOENT') {
                this.products = [];
            } else {
                throw new Error(`Error al cargar carros: ${error.message}`);
            }
        }
    }

    #saveCarts = async() => {
        try{
            const data = this.carts;
            await promises.writeFile(this.path, JSON.stringify(data));
        }
        catch(error){
            throw new Error(`Error al guardar carro: ${error.message}`);
        }
    }

    getCartById = async(cartId) => {
        await this.#loadCarts();
        const cart = this.carts.find((c) => c.id === cartId);

        return cart || null;
    }

    addCart = async() => {
        await this.#loadCarts();

        const newId = this.carts.length > 0 ? Math.max(...this.carts.map((c) => c.id)) + 1 : 1;

        const newCart = {
            id: newId,
            products: []
        }

        this.carts.push(newCart);
        await this.#saveCarts();

        return newCart;
    }

    addProductInCart = async(cartId, productId) => {
        await this.#loadCarts();

        const product = await productManager.getProductById(productId);
        if(!product) throw new Error(`Producto con ID ${productId} no encontrado.`);

        const cart = this.carts.find((c) => c.id === cartId);
        if(!cart) throw new Error(`Carro con ID ${cartId} no encontrado.`);

        const productInCart = cart.products.find((p) => p.product === productId);
        if(!productInCart){
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }else{
            productInCart.quantity += 1;
        }

        await this.#saveCarts();
        return cart;
    }
}

export const cartManager = new CartManager('./data/carts.json', './data/products.json');