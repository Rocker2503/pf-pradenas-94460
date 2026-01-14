const socket = io();

const cartId = document.getElementById('cart-id-display').innerText;
const cartBody = document.getElementById('cart-products-body');

cartBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-from-cart')) {
        const productId = e.target.getAttribute('data-id');
        if (confirm("¿Eliminar este producto del carrito?")) {
            // Emitimos un evento específico para el carrito
            socket.emit('delete_product_from_cart', { cartId, productId });
        }
    }
});

socket.on('error', (message) => {
    alert(message);
});


socket.on('cart_update', (updatedCart) => {
    let html = '';
    updatedCart.products.forEach(item => {
        html += `
            <tr id="row-${item.product._id}">
                <td>${item.product.title}</td>
                <td>$${item.product.price}</td>
                <td>${item.quantity}</td>
                <td>
                    <button class="btn btn-danger btn-sm remove-from-cart" data-id="${item.product._id}">
                        Eliminar
                    </button>
                </td>
            </tr>`;
    });
    cartBody.innerHTML = html;
});