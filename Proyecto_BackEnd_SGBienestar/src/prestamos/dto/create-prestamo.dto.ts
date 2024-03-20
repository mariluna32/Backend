import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreatePrestamoDto {

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ description: "ObjectId de implementos "})
    implementos:  [string];

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ description: "Cantidades por implementos"})
    cantidad_implementos:  [number];

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "ObjectId de usuario"})
    usuario:  string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la fecha de inicio del prestamo implemento "})
    fecha_inicio?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la fecha fin del prestamo del implemento "})
    fecha_fin?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "ObjectId estado prestamo del implemento"})
    estado: string;
}

export class UpdatePrestamoDto {
    
    @IsArray()
    @IsOptional()
    @ApiProperty({ description: "ObjectId de implemento "})
    implementos?:  [string];

    @IsArray()
    @IsOptional()
    @ApiProperty({ description: "Cantidades por implementos"})
    cantidad_implementos:  [number];

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "ObjectId de usuario"})
    usuario:  string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la fecha de inicio del prestamo implemento "})
    fecha_inicio?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la fecha fin del prestamo del implemento "}) 
    fecha_fin?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "ObjectId estado prestamo del implemento"})
    estado: string;
}

export class FinalizarPrestamoDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "ObjectId prestamo"})
    id: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "ObjectId estado prestamo"})
    estado: string;
}