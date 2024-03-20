import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger";


export class CreateDominioSenaDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el dominio SENA"})
    nombre: string;
}


export class UpdateDominioSenaDto {
    @IsString()
    @IsOptional()
    nombre: string;
}
