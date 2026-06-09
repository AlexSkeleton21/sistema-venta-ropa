import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional } from "class-validator";

export class CreaProductoDto {
    @IsString({ message: "El nombre debe ser una cadena" })
    @IsNotEmpty({ message: 'El nombre no puede ir vacío' })
    nombre: string = "";

    @IsNumber({}, { message: 'Valor no válido' })
    @IsPositive({ message: 'Precio no válido' })
    precio: number = 0;

    // 👇 AGREGAMOS IMAGEN: Para que te deje registrar el nombre de la foto (.jpg / .webp)
    @IsString({ message: "La imagen debe ser una cadena de texto" })
    @IsOptional()
    imagen?: string;

    // 👇 AGREGAMOS ESTADO: Por si quieres setearlo directamente al crear
    @IsString({ message: "El estado debe ser una cadena de texto" })
    @IsOptional()
    estado?: string;
}

export class ActualizaProductoDto {
    @IsString({ message: "El nombre debe ser una cadena" })
    @IsOptional() // 👈 Cambiado a IsOptional para que puedas actualizar solo el estado sin obligar a mandar el nombre
    nombre?: string;

    @IsNumber({}, { message: 'Valor no válido' })
    @IsPositive({ message: 'Precio no válido' })
    @IsOptional()
    precio?: number;

    @IsString({ message: "La imagen debe ser una cadena de texto" })
    @IsOptional()
    imagen?: string;

    // 👇 ¡EL MÁS IMPORTANTE! Ahora NestJS le dará permiso a React de cambiar el estado a 'Vendido' o 'Disponible'
    @IsString({ message: "El estado debe ser una cadena de texto" })
    @IsOptional()
    estado?: string;
}