import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Categoria } from "./Categoria"; // Asegúrate de que la ruta sea correcta

@Entity('Peliculas') // Coincide con el nombre de tu tabla SQL "Peliculas"
export class Pelicula {
    @PrimaryGeneratedColumn({ name: 'Id' }) // Mapea a la columna "Id"
    id!: number;

    @Column({ name: 'Nombre', length: 255 }) // Mapea a "Nombre" VARCHAR(255)
    nombre!: string;

    @Column({ name: 'Descripcion', type: 'text', nullable: false }) // Mapea a "Descripcion" TEXT
    descripcion!: string;

    @Column({ name: 'Sinapsis', type: 'text', nullable: false }) // Mapea a "Sinapsis" TEXT
    sinapsis!: string;

    // Relación Muchos-a-Uno con Categoria (Obligatoria)
    @ManyToOne(() => Categoria, categoria => categoria.peliculas, {
        nullable: false, // Hace que la relación sea obligatoria
        onDelete: 'RESTRICT' // Evita que se elimine una categoría si tiene películas asociadas
    })
    @JoinColumn({ name: 'categoriaId' })
    categoria!: Categoria; // Ya no puede ser null y usamos ! para indicar que siempre estará presente
}