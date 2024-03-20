import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateEstadoPrestamoDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Nombre de Estado Prestamo"})
    nombre: string
}

export class UpdateEstadoPrestamoDTO {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Nombre de Estado Prestamo"})
    nombre: string
}