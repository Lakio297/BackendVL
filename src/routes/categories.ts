import { Router } from "express";
import { CategoriaController } from "../controllers/CategoriaController";
import { 
    validarCreacionCategoria, 
    validarActualizacionCategoria,
    validarPaginacion 
} from "../middlewares/validaciones";

const router = Router();

// Rutas con validaciones
router.get("/", validarPaginacion, CategoriaController.getAll);
router.get("/:id", CategoriaController.getOne);
router.post("/", validarCreacionCategoria, CategoriaController.create);
router.put("/:id", validarActualizacionCategoria, CategoriaController.update);
router.delete("/:id", CategoriaController.delete);

export default router; 