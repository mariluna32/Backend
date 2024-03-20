import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ObjectDescripcionDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'Peso del implemento',
        default: ""
    })
    peso: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'Color del implemento',
        default: ""
    })
    color: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'Material del implemento',
        default: ""
    })
    material: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'Destalles del implemento',
        default: ""
    })
    detalles: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: String,
        description: 'Tamaño del implemento',
        default: ""
    })
    tamano: string;
}