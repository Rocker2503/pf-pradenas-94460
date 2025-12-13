import {productManager} from '../managers/ProductManager.js';

const configureRealTimeSockets = (io) => {
    
    return (socket) => {
        socket.on('delete_product', async (productId) => {

            try {
                await productManager.deleteProduct(parseInt(productId,10)); 
                const updatedProducts = await productManager.getProducts();
                
                io.emit('product_list_update', updatedProducts); 

            } catch (error) {
                socket.emit('error', 'No se pudo eliminar el producto.');
            }
        });

        socket.on('add_product', async(newProduct) => {
            try{
                const product = await productManager.addProduct(newProduct);
                const updatedProducts = await productManager.getProducts();
                io.emit('product_list_update', updatedProducts); 
            }
            catch(error){
                socket.emit('error', 'No se pudo agregar el producto.');
            }
        })

        socket.on('disconnect', () => {
            console.log(`[Socket Controller] Cliente desconectado con ID: ${socket.id}`);
        });
    }
};

export default configureRealTimeSockets;