import "dotenv/config";
import mongoose from "mongoose";
import { initMongo } from "./config/connection.js";
import { ProductModel } from "./models/product-model.js";

const products = [
    { title: "Manzana", description: "Manzana roja deliciosa", price: 1200, code: "FRU-001", stock: 50, category: "frutas", status: true },
    { title: "Pera", description: "Pera de agua", price: 1500, code: "FRU-002", stock: 30, category: "frutas", status: true },
    { title: "Plátano", description: "Plátano maduro", price: 900, code: "FRU-003", stock: 100, category: "frutas", status: true },
    { title: "Sandia", description: "Sandia", price: 500, code: "FRU-004", stock: 100, category: "frutas", status: false },
    { title: "Lechuga", description: "Lechuga fresca", price: 800, code: "VER-001", stock: 20, category: "verduras", status: true },
    { title: "Tomate", description: "Tomate para ensalada", price: 1100, code: "VER-002", stock: 40, category: "verduras", status: true },
    { title: "Zanahoria", description: "Zanahoria naranja", price: 600, code: "VER-003", stock: 60, category: "verduras", status: true },
    { title: "Pimiento Verde", description: "Pimiento verde", price: 200, code: "VER-004", stock: 60, category: "verduras", status: false },
    { title: "Pimiento Rojo", description: "Pimiento rojo", price: 250, code: "VER-005", stock: 50, category: "verduras", status: true },
    { title: "Pimiento Amarillo", description: "Pimiento amarillo", price: 250, code: "VER-006", stock: 80, category: "verduras", status: true },
    { title: "Monitor Gamer", description: "Monitor 144hz", price: 250000, code: "TEC-001", stock: 10, category: "tecnologia", status: true },
    { title: "Mouse Pro", description: "Mouse inalámbrico", price: 45000, code: "TEC-002", stock: 15, category: "tecnologia", status: true },
    { title: "Teclado RGB", description: "Teclado mecánico", price: 85000, code: "TEC-003", stock: 8, category: "tecnologia", status: true },
    { title: "Gabinete RGB", description: "Gabinete", price: 15500, code: "TEC-005", stock: 12, category: "tecnologia", status: true },
    { title: "Audífonos BT", description: "Cancelación de ruido", price: 120000, code: "TEC-004", stock: 5, category: "tecnologia", status: false }
];

const seedDB = async () => {
    try {
        await initMongo(); // Conectamos a Atlas usando tu función
        
        console.log("🧹 Limpiando base de datos...");
        await ProductModel.deleteMany({}); // Borra lo anterior para no duplicar por el campo "code" único

        console.log("🌱 Insertando productos...");
        await ProductModel.insertMany(products);
        
        console.log("✅ ¡Base de datos poblada con éxito!");
        mongoose.connection.close(); // Cerramos la conexión al terminar
    } catch (error) {
        console.error("❌ Error en el seed:", error);
        process.exit(1);
    }
};

seedDB();