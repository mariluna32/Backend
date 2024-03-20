import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateRegistroDTO{
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "El nombre del usuario"})
    readonly nombres: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "El apellido del usuario"})
    readonly apellidos: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "El documento del usuario"})
    readonly tipo_doc: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "El numero de documento del usuario"})
    readonly n_doc: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "El telefono del usuario"})
    readonly telefono: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: "El correo institucional del usuario"})
    readonly correo_inst: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    @ApiProperty({ description: "El correo personal del usuario"})
    readonly correo_pers?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "La fecha de nacimiento del usuario"})
    readonly nacimiento?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "El rol del usuario"})
    readonly rol: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "la contraseña del usuario"})
    contrasena: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la ficha del usuario"})
    readonly ficha?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "la direccion del usuario"})
    readonly direccion: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el tipo de sangre del usuario"})
    readonly rh?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el genero del usuario"})
    readonly genero: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la eps del usuario"})
    readonly eps?: string;

    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({ description: "la politica de privacidad y seguridad del usuario"})
    readonly pps: boolean; // Politica de Provacidad y seguridad

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el token del usuario"})
    token: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el codigo acti del usuario"})
    codigo: string;
}



export class UpdateRegistroDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "El nombre del usuario"})
    readonly nombres?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "El apellido del usuario"})
    readonly apellidos?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "El documento del usuario"})
    readonly tipo_doc?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "El numero de documento del usuario"})
    readonly n_doc?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "El telefono del usuario"})
    readonly telefono?: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    @ApiProperty({ description: "El correo institucional del usuario"})
    readonly correo_inst?: string;

    @IsString()
    @IsOptional()
    @IsEmail()
    @ApiProperty({ description: "El correo personal del usuario"})
    readonly correo_pers?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "La fecha de nacimiento del usuario"})
    readonly nacimiento?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "El rol del usuario"})
    readonly rol?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la contraseña del usuario"})
    contrasena?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la ficha del usuario"})
    readonly ficha?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la direccion del usuario"})
    readonly direccion?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el tipo de sangre del usuario"})
    readonly rh?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el genero del usuario"})
    readonly genero?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la eps del usuario"})
    readonly eps?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Los prestamos del usuario"})
    readonly prestamos: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "Las sanciones del usuario"})
    readonly sanciones: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ description: "cuenta activada"})

    activacion: boolean;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el codigo acti del usuario"})
    codigo: string;
}