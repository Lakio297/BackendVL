import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Categoria } from "../models/Categoria";
import { Not } from "typeorm";

const categoriaRepository = AppDataSource.getRepository(Categoria);

export class CategoriaController {
    static async getAll(req: Request, res: Response) {
        try {
            // Si no se solicita paginación, devolver todas las categorías
            if (!req.query.page) {
                const categorias = await categoriaRepository.find({
                    order: { nombre: "ASC" }
                });
                return res.json(categorias);
            }

            // Si se solicita paginación
            const { page = 1, limit = 10 } = req.query;
            const skip = (Number(page) - 1) * Number(limit);

            const [categorias, total] = await categoriaRepository.findAndCount({
                skip,
                take: Number(limit),
                order: { nombre: "ASC" }
            });

            return res.json({
                categorias,
                total,
                pagina: Number(page),
                ultimaPagina: Math.ceil(total / Number(limit))
            });
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al obtener las categorías", error });
        }
    }

    static async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const categoria = await categoriaRepository.findOne({
                where: { id: parseInt(id) },
                relations: ["peliculas"]
            });

            if (!categoria) {
                return res.status(404).json({ mensaje: "Categoría no encontrada" });
            }

            return res.json(categoria);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al obtener la categoría", error });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const { nombre, descripcion } = req.body;

            if (!nombre) {
                return res.status(400).json({ mensaje: "El nombre de la categoría es requerido" });
            }

            const categoriaExistente = await categoriaRepository.findOne({
                where: { nombre }
            });

            if (categoriaExistente) {
                return res.status(400).json({ mensaje: "Ya existe una categoría con ese nombre" });
            }

            const categoria = categoriaRepository.create({ nombre, descripcion });
            await categoriaRepository.save(categoria);
            return res.status(201).json(categoria);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al crear la categoría", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;

            const categoria = await categoriaRepository.findOneBy({ id: parseInt(id) });
            if (!categoria) {
                return res.status(404).json({ mensaje: "Categoría no encontrada" });
            }

            if (nombre) {
                const categoriaExistente = await categoriaRepository.findOne({
                    where: { nombre, id: Not(parseInt(id)) }
                });

                if (categoriaExistente) {
                    return res.status(400).json({ mensaje: "Ya existe una categoría con ese nombre" });
                }
            }

            categoriaRepository.merge(categoria, { 
                nombre: nombre || categoria.nombre,
                descripcion: descripcion || categoria.descripcion 
            });
            
            const results = await categoriaRepository.save(categoria);
            return res.json(results);
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al actualizar la categoría", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const categoria = await categoriaRepository.findOne({
                where: { id: parseInt(id) },
                relations: ["peliculas"]
            });
            
            if (!categoria) {
                return res.status(404).json({ mensaje: "Categoría no encontrada" });
            }

            // Verificar si hay películas vinculadas
            if (categoria.peliculas && categoria.peliculas.length > 0) {
                return res.status(400).json({ 
                    mensaje: "No se puede eliminar la categoría porque tiene películas vinculadas",
                    peliculasVinculadas: categoria.peliculas.length
                });
            }

            await categoriaRepository.remove(categoria);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ mensaje: "Error al eliminar la categoría", error });
        }
    }
} 