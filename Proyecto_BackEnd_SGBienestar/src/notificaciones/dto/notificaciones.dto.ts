import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class NotificacionesDTO {
    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ description: "Usuarios destino"})
    usuarios:  [string];

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Titulo de la notificacion"})
    titulo:  string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Mensaje de la notificacion"})
    mensaje:  string;
}