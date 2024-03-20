import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "el nombre de la eps"})
  nombre: string;
}

export class UpdateEpsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: "el nombre de la eps"})

  nombre: string;
}

