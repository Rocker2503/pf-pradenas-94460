const socket = io();

const formProducts = document.getElementById('formProducts');
const productListBody = document.getElementById('product-list-body');

formProducts.addEventListener('submit', (e) =>{
    e.preventDefault();

    const newProduct = {
        code: document.getElementById('code').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value), 
        category: document.getElementById('category').value,
        stock: parseInt(document.getElementById('stock').value, 10),
        thumbnails: ''
    };

    socket.emit('add_product', newProduct);
    formProducts.reset();
});

productListBody.addEventListener('click', (e) => {
    if(e.target.classList.contains('delete-product')){
        const productId = e.target.getAttribute('data-id');

        if (confirm(`¿Está seguro de eliminar el producto con ID: ${productId}?`)) {
            socket.emit('delete_product', productId);
        }
    }
});

socket.on('product_list_update', (productos) =>{
    renderProductList(productos);
});

socket.on('error', (message) => {
    alert(message);
});

function renderProductList(productos) {
    let html = '';
    productos.forEach(producto => {
        html += `
            <tr id="row-${producto.id}">
                <td>${producto.code}</td>
                <td>${producto.title}</td>
                <td>$${producto.price}</td>
                <td>${producto.stock}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-product" data-id="${producto.id}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
    productListBody.innerHTML = html;
}