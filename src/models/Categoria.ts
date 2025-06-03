import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Pelicula } from "./Pelicula"; // Asegúrate de que la ruta sea correcta

@Entity('Categorias') // Coincide con el nombre de tu tabla SQL "Categorias"
export class Categoria {
    @PrimaryGeneratedColumn({ name: 'Id' })
    id!: number;

    @Column({ name: 'Nombre', length: 255 })
    nombre!: string;

    @Column({ name: 'Descripcion', type: 'text', nullable: false }) // La descripción es requerida
    descripcion!: string;

    @OneToMany(() => Pelicula, pelicula => pelicula.categoria)
    peliculas!: Pelicula[];
}