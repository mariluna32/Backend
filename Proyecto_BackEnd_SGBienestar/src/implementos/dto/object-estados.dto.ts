import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ObjectEstadoDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'ObjectId de Estado de Implemento'
    })
    estado: string;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        type: Number,
        description: 'Cantidad del implemento con este estado',
        default: 0
    })
    cantidad: number;
    @IsBoolean()
    @IsNotEmpty()
    @ApiProperty({
        type: Boolean,
        description: 'Apto para prestamo',
        default: true
    })
    apto: boolean;
}