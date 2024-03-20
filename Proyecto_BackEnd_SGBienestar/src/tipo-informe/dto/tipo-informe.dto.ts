import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateTipoInformeDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Nombre del tipo de informe"})
    nombre: string

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: "Numero de informe"})
    numero: number
}

export class UpdateTipoInformeDTO {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Nombre del tipo de informe"})
    nombre: string

    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: "Numero de informe"})
    numero: number
}