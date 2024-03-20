import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
export class CreateJornadaDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el nombre de la jornada"})
    nombre: string
}
