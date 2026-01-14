import Router from "express";
import { ProductModel } from "../models/product-model.js";

const router = Router();

// GET /api/products/
router.get('/', async (req, res) => {
    try {
        // Recibir parámetros por query params [cite: 20]
        const { limit = 10, page = 1, sort, query } = req.query; 

        // Configurar el filtro (query) [cite: 24, 40]
        // Filtra por categoría o por disponibilidad (status)
        let filter = {};
        if (query) {
            filter = { 
                $or: [
                    { category: query },
                    { status: query === 'true' } 
                ]
            };
        }

        // Configurar opciones de paginación y ordenamiento [cite: 25, 27]
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}, 
            lean: true // Importante para Handlebars después
        };

        const result = await ProductModel.paginate(filter, options);

        // Formato de respuesta requerido por la entrega [cite: 28, 29]
        res.status(200).json({
            status: 'success', 
            payload: result.docs, 
            totalPages: result.totalPages, 
            prevPage: result.prevPage, 
            nextPage: result.nextPage, 
            page: result.page, 
            hasPrevPage: result.hasPrevPage, 
            hasNextPage: result.hasNextPage, 
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null, 
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null 
        });

    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;