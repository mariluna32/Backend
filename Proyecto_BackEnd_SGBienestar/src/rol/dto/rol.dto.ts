/*eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "el nombre del usuario"})
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "el privilegio del usuario"})
  privilegio: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: "La duracion prestamo implemento maxima para el rol en Horas"})
  duracion_prestamo: number;
};

export class UpdateRolDtO{
  @IsString()
  @IsOptional()
  @ApiProperty({ description: "el nombre del usuario"})
  nombre: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "el privilegio del usuario"})
  privilegio: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "La duracion prestamo implemento maxima para el rol en Horas"})
  duracion_prestamo: number;
}