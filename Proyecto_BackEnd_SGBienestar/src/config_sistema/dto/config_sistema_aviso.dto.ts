import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateConfigSistemaAvisoDto {
    @IsString()
    @IsNotEmpty()
    titulo: string;
    @IsString()
    @IsNotEmpty()
    mensaje: string;
    @IsString()
    @IsNotEmpty()
    hora_inicio: string;
    @IsString()
    @IsNotEmpty()
    hora_fin: string;
    @IsString()
    @IsOptional()
    src: string;
}

export class UpdateConfigSistemaAvisoDto {
    @IsString()
    @IsOptional()
    titulo: string;
    @IsString()
    @IsOptional()
    mensaje: string;
    @IsString()
    @IsOptional()
    hora_inicio: string;
    @IsString()
    @IsOptional()
    hora_fin: string;
    @IsString()
    @IsOptional()
    src: string;
}