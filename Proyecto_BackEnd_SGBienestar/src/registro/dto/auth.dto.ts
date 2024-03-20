import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "El codigo de usuario"})
    codigo: string
}