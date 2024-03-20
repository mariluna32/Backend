import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class Solicitud{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el correo del usuario"})
    correo: string
}