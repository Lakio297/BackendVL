import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Pelicula } from "../models/Pelicula";
import { Categoria } from "../models/Categoria";
import { Like } from "typeorm";

const peliculaRepository = AppDataSource.getRepository(Pelicula);
const categoriaRepository = AppDataSource.getRepository(Categoria);

export class PeliculaController {
    static async getAll(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, nombre, categoriaId } = req.query;
            const skip = (Number(page) - 1) * Number(limit);

            // Construir el where dinámicamente
            let where: any = {};
            if (nombre) {
                where.nombre = Like(`%${nombre}%`);
            }
            if (categoriaId) {
                where.categoria = { id: Number(categoriaId) };
            }

            const [peliculas, total] = await peliculaRepository.findAndCount({
                where,
                relations: ["categoria"],
                skip,
                take: Number(limit),
                order: {
                    nombre: "ASC"
                }
            });

            return res.json({
                peliculas,
                total,
                pagina: Number(page),
                ultimaPagina: Math.ceil(total / Number(limit))
            });
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al obtener las películas", error });
        }
    }

    static async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const pelicula = await peliculaRepository.findOne({
                where: { id: parseInt(id) },
                relations: ["categoria"]
            });

            if (!pelicula) {
                return res.status(404).json({ mensaje: "Película no encontrada" });
            }

            return res.json(pelicula);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al obtener la película", error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { nombre, descripcion, sinapsis, categoriaId } = req.body;

            // Validaciones básicas
            if (!nombre || !categoriaId) {
                return res.status(400).json({ 
                    mensaje: "Faltan campos requeridos (nombre, categoriaId)" 
                });
            }

            const categoria = await categoriaRepository.findOneBy({ id: categoriaId });
            if (!categoria) {
                return res.status(404).json({ mensaje: "Categoría no encontrada" });
            }

            const pelicula = peliculaRepository.create({
                nombre,
                descripcion,
                sinapsis,
                categoria
            });

            await peliculaRepository.save(pelicula);
            return res.status(201).json(pelicula);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al crear la película", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, sinapsis, categoriaId } = req.body;

            const pelicula = await peliculaRepository.findOne({
                where: { id: parseInt(id) },
                relations: ["categoria"]
            });

            if (!pelicula) {
                return res.status(404).json({ mensaje: "Película no encontrada" });
            }

            if (categoriaId) {
                const categoria = await categoriaRepository.findOneBy({ id: categoriaId });
                if (!categoria) {
                    return res.status(404).json({ mensaje: "Categoría no encontrada" });
                }
                pelicula.categoria = categoria;
            }

            peliculaRepository.merge(pelicula, { 
                nombre: nombre || pelicula.nombre,
                descripcion: descripcion || pelicula.descripcion,
                sinapsis: sinapsis || pelicula.sinapsis
            });

            const results = await peliculaRepository.save(pelicula);
            return res.json(results);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al actualizar la película", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const pelicula = await peliculaRepository.findOneBy({ id: parseInt(id) });
            
            if (!pelicula) {
                return res.status(404).json({ mensaje: "Película no encontrada" });
            }

            await peliculaRepository.remove(pelicula);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al eliminar la película", error });
        }
    }
} 