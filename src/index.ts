import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import rutasPeliculas from "./routes/movies";
import rutasCategorias from "./routes/categories";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PUERTO = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/peliculas", rutasPeliculas);
app.use("/api/categorias", rutasCategorias);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        mensaje: "Ruta no encontrada",
        ruta: req.originalUrl,
        metodo: req.method
    });
});

// Middleware para manejar errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        mensaje: "Error interno del servidor",
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// Conexión a la base de datos e inicio del servidor
AppDataSource.initialize()
    .then(() => {
        console.log("Conexión a la base de datos establecida");
        app.listen(PUERTO, () => {
            console.log(`Servidor corriendo en el puerto ${PUERTO}`);
        });
    })
    .catch((error) => {
        console.error("Error al conectar con la base de datos:", error);
    }); 