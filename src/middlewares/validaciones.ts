import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from "../config/database";
import { Categoria } from "../models/Categoria";

const categoriaRepository = AppDataSource.getRepository(Categoria);

export const validarCreacionPelicula = async (req: Request, res: Response, next: NextFunction) => {
    const { nombre, descripcion, sinapsis, categoriaId } = req.body;
    const errores = [];

    if (!nombre) {
        errores.push("El nombre es requerido");
    }

    if (!descripcion) {
        errores.push("La descripción es requerida");
    } else if (descripcion.trim() === '') {
        errores.push("La descripción no puede estar vacía");
    }

    if (!sinapsis) {
        errores.push("La sinopsis es requerida");
    } else if (sinapsis.trim() === '') {
        errores.push("La sinopsis no puede estar vacía");
    }

    if (!categoriaId) {
        errores.push("La categoría es requerida");
    } else if (isNaN(categoriaId) || categoriaId < 1) {
        errores.push("El ID de la categoría debe ser un número válido");
    } else {
        // Verificar si la categoría existe
        const categoriaExiste = await categoriaRepository.findOneBy({ id: categoriaId });
        if (!categoriaExiste) {
            errores.push(`La categoría con ID ${categoriaId} no existe`);
        }
    }

    if (errores.length > 0) {
        return res.status(400).json({ mensaje: "Error de validación", errores });
    }

    next();
};

export const validarActualizacionPelicula = async (req: Request, res: Response, next: NextFunction) => {
    const { nombre, descripcion, sinapsis, categoriaId } = req.body;
    const errores = [];

    if (nombre !== undefined && nombre.trim() === '') {
        errores.push("El nombre no puede estar vacío");
    }

    if (descripcion !== undefined && descripcion.trim() === '') {
        errores.push("La descripción no puede estar vacía");
    }

    if (sinapsis !== undefined && sinapsis.trim() === '') {
        errores.push("La sinopsis no puede estar vacía");
    }

    if (categoriaId !== undefined) {
        if (isNaN(categoriaId) || categoriaId < 1) {
            errores.push("El ID de la categoría debe ser un número válido");
        } else {
            // Verificar si la categoría existe
            const categoriaExiste = await categoriaRepository.findOneBy({ id: categoriaId });
            if (!categoriaExiste) {
                errores.push(`La categoría con ID ${categoriaId} no existe`);
            }
        }
    }

    if (errores.length > 0) {
        return res.status(400).json({ mensaje: "Error de validación", errores });
    }

    next();
};

export const validarCreacionCategoria = (req: Request, res: Response, next: NextFunction) => {
    const { nombre, descripcion } = req.body;
    const errores = [];

    if (!nombre) {
        errores.push("El nombre es requerido");
    } else if (nombre.trim() === '') {
        errores.push("El nombre no puede estar vacío");
    }

    if (!descripcion) {
        errores.push("La descripción es requerida");
    } else if (descripcion.trim() === '') {
        errores.push("La descripción no puede estar vacía");
    }

    if (errores.length > 0) {
        return res.status(400).json({ mensaje: "Error de validación", errores });
    }

    next();
};

export const validarActualizacionCategoria = (req: Request, res: Response, next: NextFunction) => {
    const { nombre, descripcion } = req.body;
    const errores = [];

    if (nombre !== undefined && nombre.trim() === '') {
        errores.push("El nombre no puede estar vacío");
    }

    if (descripcion !== undefined && descripcion.trim() === '') {
        errores.push("La descripción no puede estar vacía");
    }

    if (errores.length > 0) {
        return res.status(400).json({ mensaje: "Error de validación", errores });
    }

    next();
};

export const validarPaginacion = (req: Request, res: Response, next: NextFunction) => {
    const { page, limit } = req.query;
    const errores = [];

    if (page !== undefined) {
        const pageNum = Number(page);
        if (isNaN(pageNum) || pageNum < 1) {
            errores.push("El número de página debe ser un número positivo");
        }
    }

    if (limit !== undefined) {
        const limitNum = Number(limit);
        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
            errores.push("El límite debe ser un número entre 1 y 100");
        }
    }

    if (errores.length > 0) {
        return res.status(400).json({ mensaje: "Error de validación", errores });
    }

    next();
}; 