/* eslint-disable */
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailSendDTO } from 'src/mail/dto/mail.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { RegistroGuard } from 'src/guards/registro.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { ComentarioSendDTO } from './dto/comentario.dto';

@ApiTags("EMAIL")
//@UseGuards(RegistroGuard,RolesGuard)
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

//  @Roles('Admin')
  @Post()
  async sendMails(@Body() body: MailSendDTO, @Res() res: Response) {
    return await this.mailService.makeMail(body, res);
  } 

  @Post('/admin')
  async AdminsendMails(@Body() body: MailSendDTO, @Res() res: Response) {
    return await this.mailService.AdminNotificacion(body, res);
  } 
  @Post('/usuario/notificacion')
  async ComentariosUsuarios(@Body() body: ComentarioSendDTO, @Res() res: Response) {
    return await this.mailService.ComentarioUsuario(body, res);
  } 

  @Delete("/mail/:id")
  delete(@Param("id") id: string){
      return this.mailService.delete(id);
  }
  @Get("/mail/:id")
  findOneById(@Param("id") id?: string){
      return this.mailService.findOneById(id);    
  }
  @Get()
  find_All(){
    return this.mailService.findAll()
  }

  @Delete("/comentario/:id")
  deleteComentario(@Param("id") id: string){
      return this.mailService.deleteComentario(id);
  }
  @Get("/comentario/:id")
  findOneComentarioById(@Param("id") id?: string){
      return this.mailService.findOneComentarioById(id);    
  }
  @Get("/comentario")
  find_AllComentariosl(){
    return this.mailService.findAllComentarios()
  }

  @Get("/comentario/usuario/:id")
  findComentariosXusuarioXid(@Param("id") id: string){
    return this.mailService.findComentariosXusuarioXid(id);
  }
};

