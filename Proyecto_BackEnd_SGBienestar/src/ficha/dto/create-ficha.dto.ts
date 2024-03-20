import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class CreateFichaDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el codigo de la ficha"})
    codigo: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el id del programa"})
    programa: string

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el id de la jornada"})
    jornada: string

}

export class UpdateFichaDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el codigo de la ficha"})
    codigo: string

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el id del programa"})
    programa: string

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el id de la jornada"})
    jornada: string

}