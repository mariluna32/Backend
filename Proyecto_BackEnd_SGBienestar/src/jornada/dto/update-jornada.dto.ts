import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateJornadaDto } from './create-jornada.dto';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateJornadaDto{

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el nombre de la jornada"})
    nombre: string
}
