import { DataSource } from "typeorm";
import { Pelicula } from "../models/Pelicula";
import { Categoria } from "../models/Categoria";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "192.168.100.2",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "cleohermosa",
    database: process.env.DB_DATABASE || "PeliculasVL",
    synchronize: true,
    logging: true,
    entities: [Pelicula, Categoria],
    subscribers: [],
    migrations: [],
});