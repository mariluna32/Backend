import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateSancioneDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "objectId del usuario"})
    usuario: string
    @IsString()
    @IsNotEmpty()    
    @ApiProperty({ description: "Descripcion de la sancion"})
    description: string
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ description: "Estado de la sancion"})
    estado: boolean
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: "Duracion de la sancion"})
    duracion: number
}

export class UpdateSancioneDto{
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "objectId del usuario"})
    usuario: string
    @IsString()
    @IsOptional()    
    @ApiProperty({ description: "Dscripcion de la sancion"})
    descripcion: string
    @IsBoolean()
    @IsOptional()
    @ApiProperty({ description: "Estado de la sancion"})
    estado: boolean
    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: "Duracion de la sancion"})
    duracion: number
}