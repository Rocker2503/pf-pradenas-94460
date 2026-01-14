import { ProductModel } from "../models/product-model.js";

export const getPaginatedList = async(req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query; 

        let filter = {};
        if (query) {
            filter = { 
                $or: [
                    { category: query },
                    { status: query === 'true' } 
                ]
            };
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}, 
            lean: true 
        };

        const result = await ProductModel.paginate(filter, options);

        // Formato de respuesta 
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
};