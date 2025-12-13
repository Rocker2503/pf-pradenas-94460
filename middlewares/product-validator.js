export const productValidator = (req, res, next) => {
    const { title, description, code, price, stock, category } = req.body;
    if(!title || typeof title !== "string") return res.status(400).json({ error: "Title debe ser de tipo string"});
    if(!description || typeof description !== "string") return res.status(400).json({ error: "Description debe ser de tipo string"});
    if(!code || typeof code !== "string") return res.status(400).json({ error: "Code debe ser de tipo string"});
    if(!price || typeof price !== "number") return res.status(400).json({ error: "Price debe ser de tipo number"});
    if(!stock || typeof stock !== "number") return res.status(400).json({ error: "Stock debe ser de tipo number"});
    if(!category || typeof category !== "string") return res.status(400).json({ error: "Category debe ser de tipo string"});
    if( !title || !price || !description || !code || !stock || !category ) return res.status(400).json({ error: "Los campos son requeridos"});
    return next();
}