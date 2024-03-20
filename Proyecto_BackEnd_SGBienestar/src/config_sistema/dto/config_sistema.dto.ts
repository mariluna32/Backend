import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateConfigSistemaDto {
    @IsString()
    @IsNotEmpty()
    horario_inicio: string;
    @IsString()
    @IsNotEmpty()
    horario_fin: string;
    @IsNumber()
    @IsNotEmpty()
    duracion_prestamo: number;
    @IsNumber()
    @IsNotEmpty()
    duracion_sancion: number;
}

export class UpdateConfigSistemaDto {
    @IsString()
    @IsOptional()
    horario_inicio: string;
    @IsString()
    @IsOptional()
    horario_fin: string;
    @IsNumber()
    @IsOptional()
    duracion_prestamo: number;
    @IsNumber()
    @IsOptional()
    duracion_sancion: number;
}