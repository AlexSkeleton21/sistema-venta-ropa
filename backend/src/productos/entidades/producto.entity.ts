import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity("productos")
export class Producto {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column({ length: 100, nullable: false })
    nombre: string = "";

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    precio: number = 0;

    @Column({ length: 255, nullable: false, default: 'default.jpg' })
    imagen: string = "";

    @Column({ length: 20, nullable: false, default: 'Disponible' }) // 👈 ¡NUEVA COLUMNA!
    estado: string = "Disponible";
}