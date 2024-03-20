/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MailSendDTO {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: "el correo de usuario"})
  correo: string[];

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "el mensaje"})
  mensaje: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: "el asunto"})
  asunto: string;
}
