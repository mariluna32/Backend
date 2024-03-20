import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el correo del usuario"})
    correo: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el codigo autenticacion del usuario"})
    codigo: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "la nueva password del usuario"})
    newPassword: string
}