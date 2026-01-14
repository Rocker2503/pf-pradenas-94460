import { CartModel } from "../models/cart-model.js";
import { ProductModel } from "../models/product-model.js";

const configureRealTimeSockets = (io) => {
    
    return (socket) => {
        socket.on('delete_product', async (productId) => {
            try{
                await ProductModel.findByIdAndDelete(productId)

                const updatedProducts = await ProductModel.find().lean();
                io.emit('product_list_update', updatedProducts);

            }catch(error){
                socket.emit('error', 'No se pudo eliminar el producto de la base de datos.');
            }
        });

        socket.on('add_product', async(newProduct) => {
            try{
                await ProductModel.create(newProduct);

                const updatedProducts = await ProductModel.find().lean(); 

                io.emit('product_list_update', updatedProducts);
            }catch(error){
                socket.emit('error', 'No se pudo crear el producto de la base de datos porque el codigo ya existe.');
            }
        })

        socket.on('delete_product_from_cart', async ({ cartId, productId }) => {
            console.log("Iniciando eliminación de producto del carrito");
            try {
                const cart = await CartModel.findById(cartId);
                
                if (!cart) {
                    return socket.emit('error', "Carrito no encontrado");
                }

                const originalLength = cart.products.length;

                cart.products = cart.products.filter(p => {
                    const pId = p.product._id ? p.product._id.toString() : p.product.toString();
                    return pId !== productId;
                });

                if (cart.products.length !== originalLength) {
                    await cart.save();

                    const updatedCart = await CartModel.findById(cartId)
                        .populate('products.product')
                        .lean();

                    io.emit('cart_update', updatedCart);
                    console.log("Producto eliminado y carrito emitido");
                } else {
                    socket.emit('error', "El producto no existía en el carrito");
                }
            } catch (error) {
                console.error(error);
                socket.emit('error', 'Error interno al eliminar del carrito');
            }
        });

        socket.on('disconnect', () => {
            console.log(`[Socket Controller] Cliente desconectado con ID: ${socket.id}`);
        });
    }
};

export default configureRealTimeSockets;