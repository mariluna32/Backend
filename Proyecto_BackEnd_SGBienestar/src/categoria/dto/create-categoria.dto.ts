import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string
  @IsString()
  @IsNotEmpty()
  img: string
}

  export class UpdateCategoriaDto {
    @IsString()
    @IsOptional()
    nombre: string
    @IsString()
    @IsOptional()
    img: string
  }