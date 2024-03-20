/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ComentarioSendDTO {
  
  @IsOptional()
  @ApiProperty({ description: "el correo de usuario"})
  readonly correo : string ;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "el mensaje"})
  readonly mensaje: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "el asunto"})
  readonly asunto: string;
}
