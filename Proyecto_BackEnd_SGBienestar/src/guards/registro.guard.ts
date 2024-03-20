import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { MENSAJES_ERROR } from 'src/StringValues';
import { useToken } from '../utils/use.token';
import { IsUseToken } from '../interfaces/registro.interfaces';
import { Rol } from 'src/rol/schema/rol.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RolService } from 'src/rol/rol.service';
import { PUBLIC_KEY } from 'src/constants/key-decorator';
import { RegistroService } from 'src/registro/registro.service';

@Injectable()
export class RegistroGuard implements CanActivate {
  constructor(
    private readonly registroService: RegistroService,
    private readonly reflector: Reflector,
    private readonly rolService: RolService
  ){}
  
  async canActivate(
    context: ExecutionContext,
  ) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler()
    )
    if(isPublic){
      return true
    }

    const req = context.switchToHttp().getRequest<Request>()
    const token = req.headers['api_token']
    if(!token || Array.isArray(token)){
      throw new HttpException(MENSAJES_ERROR.TOKEN_INVALIDO, HttpStatus.UNAUTHORIZED)
      
    }

    const manageToken: IsUseToken | string = useToken(token)
    if(typeof manageToken === 'string'){
      throw new UnauthorizedException(manageToken) //Crear un mensaje de error para esto
    }

    if(manageToken.isExpired){
      throw new HttpException(MENSAJES_ERROR.TOKEN_INVALIDO, HttpStatus.UNAUTHORIZED),
      console.log(useToken(token)) //Cambiar el mensaje de error
    }
    const { id } = manageToken
    const user = await this.registroService.findOneById(id)
    if(!user){
      throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.NOT_FOUND)
    }
    try {
      const roles = await this.rolService.findAll()
      const rolesNombre = roles.find(id => id._id.toString() === user.rol.toString());
      if (!rolesNombre || rolesNombre === undefined) {
        throw new Error('Rol no encontrado en la base de datos');
      }
      req.idUser = user.id
      req.rolUser = rolesNombre.nombre;
      console.log(rolesNombre.nombre);
      return true;
    } catch (error) {
      console.error('Error al buscar roles en la base de datos:', error);
      throw new HttpException('Error en el servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
