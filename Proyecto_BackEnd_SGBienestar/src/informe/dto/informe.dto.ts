import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateInformeDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "ObjectID Tipo de informe"})
    tipo_informe: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "ObjectID usuario que genera el informe"})
    usuario: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Dependencia a la que pertenece el usuario"})
    dependencia: string

    @IsOptional()
    @ApiProperty({ description: "lista de implementos nuevos"})
    implemento: [ImplementoInformeDTO]

    @IsOptional()
    @IsArray()
    @ApiProperty({ description: "Lista de objectId de estado de implementos"})
    estado_implemento: [string]

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Estado de la sancion Activo - Inactivo - Activo, Inactivo"})
    estado: string

    @IsArray()
    @IsOptional()
    @ApiProperty({ description: "ObjectID de usuarios a filtrar en sanciones"})
    usuarios: [string]

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Observaciones"})
    observaciones: string
}

class ImplementoInformeDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Nombre del implemento"})
    nombre: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: "Cantidad de implemento"})
    cantidad: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Caracteristica de implemento"})
    caracteristicas: string
}