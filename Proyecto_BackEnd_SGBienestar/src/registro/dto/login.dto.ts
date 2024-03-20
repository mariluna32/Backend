import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
export class LoginDto{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ description: "El correo institucional de usuario"})
    correo_inst: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "El contraseña del usuario"})
    contrasena: string
}