import { Router } from "express";
import { PeliculaController } from "../controllers/PeliculaController";
import { 
    validarCreacionPelicula, 
    validarActualizacionPelicula,
    validarPaginacion 
} from "../middlewares/validaciones";

const router = Router();

// Rutas con validaciones
router.get("/", validarPaginacion, PeliculaController.getAll);
router.get("/:id", PeliculaController.getOne);
router.post("/", validarCreacionPelicula, PeliculaController.create);
router.put("/:id", validarActualizacionPelicula, PeliculaController.update);
router.delete("/:id", PeliculaController.delete);

export default router;