const fs = require('node:fs'); 

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
    }

    #loadProducts = async() => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            this.products = data ? JSON.parse(data) : [];
        } catch (error) {
            if (error.code === 'ENOENT') {
                this.products = [];
            } else {
                throw new Error(`Error al cargar productos: ${error.message}`);
            }
        }
    }

    #saveProducts = async() => {
        try {
            const data = this.products;
            await fs.promises.writeFile(this.path, JSON.stringify(data));
        } catch (error) {
            throw new Error(`Error al guardar productos: ${error.message}`);
        }
    }


    getProducts = async() => {
        await this.#loadProducts(); 
        return this.products;
    }

   addProduct = async(productData) => {
        await this.#loadProducts();

        console.log(productData);
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        const missingFields = requiredFields.filter(field => !productData.hasOwnProperty(field));
        if (missingFields.length > 0) {
            throw new Error(`Faltan campos obligatorios: ${missingFields.join(', ')}`);
        }

        const newId = this.products.length > 0  ? Math.max(...this.products.map(p => p.id)) + 1 : 1;

        const newProduct = {
            id: newId,
            ...productData,
            status: productData.status !== undefined ? productData.status : true, // Default true
            thumbnails: productData.thumbnails || [] // Default array vacío
        };

        this.products.push(newProduct);
        await this.#saveProducts(); // Guarda los cambios
        
        return newProduct;
    }

    getProductById = async(id) => {
        await this.#loadProducts();
        const product = this.products.find(p => p.id === id);
        return product || null;
    }

    updateProduct = async(id, updates) => {
        await this.#loadProducts();

        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error(`Producto con ID ${id} no encontrado.`);

        delete updates.id; 

        this.products[index] = {
            ...this.products[index], 
            ...updates               
        };

        await this.#saveProducts();
        return this.products[index];
    }

    deleteProduct = async(id) => {
        await this.#loadProducts();

        const initialLength = this.products.length;

        const product = this.products.find((p) => p.id === id);
        if(product === undefined) throw new Error(`Producto con ID ${id} no encontrado para eliminar.`);

        this.products = this.products.filter(p => p.id !== id);

        if (this.products.length === initialLength) {
            return new Error(`Producto con ID ${id} no encontrado para eliminar.`);
        }

        await this.#saveProducts();
    }
}

module.exports = ProductManager;