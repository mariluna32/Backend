import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class CreateMarcaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string
}

  export class UpdateMarcaDto {
    @IsString()
    @IsOptional()
    nombre: string
  }