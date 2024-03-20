import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RegistroService } from './registro.service';
import { CreateRegistroDTO, UpdateRegistroDTO } from 'src/registro/dto/registro.dto';
import * as bcrypt from 'bcryptjs';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthDto } from './dto/auth.dto';
import { Solicitud } from './dto/solicitud.dto';
import { ResetPasswordDto } from './dto/resetpass.dto';

@ApiTags("Registro")
@Controller('registro')
export class RegistroController {
    constructor(private readonly registroService: RegistroService){}
    
    @Get("/info")
    findInfoUsuers(){
        return this.registroService.findAllUsers()
    }
    @Get("/usuario/prestamos")
    findInfoUsuersWithPrestamos(){
        return this.registroService.findAllUsersWithPrestamos_Sanciones()
    }
    @Post("/rest")
    async peticionRest(@Body() correo: Solicitud){
        return await this.registroService.solicitudCambioContrasena(correo)
        
    }
    
    @Post("/rest/password")
    async cambioContrasena(@Body() dto: ResetPasswordDto){
        return await this.registroService.resetPassword(dto)
    }
    @Get("/usuario")
    findAll(){
        return this.registroService.findAll();
    }

    @Post("/login")
    async login(@Body() body: LoginDto) {
        const result = await this.registroService.login(body);
        return result;
    }
  
    @Get("/usuario/:id")
    findOneById(@Param("id") id?: string){
        return this.registroService.findOneById(id);    
    }
    
    @Get("/usuario/token/:token")
    findOneByToken(@Param("token") token?: string){
        return this.registroService.findOneByToken(token);    
    }

    @Get("/usuario/findByMail/:correo_inst")
    findOneByMail(@Param("correo_inst") correo_inst?: string){
        return this.registroService.findOneByMail(correo_inst);    
    }

    @Post()
    async create(@Body() body: CreateRegistroDTO) {
        const hashPass = await bcrypt.hash(body.contrasena, 8);
        body.contrasena = hashPass.toString();
        //const isPasswordValid = await bcrypt.compare('pass', hashPass);
        return this.registroService.create(body);
    }

    @Delete("/usuario/:id")
    delete(@Param("id") id: string){
        return this.registroService.delete(id);
    }

    @Put("/usuario/:id")
    update(@Param("id") id: string, @Body() body:UpdateRegistroDTO){
        return this.registroService.update(id, body);
    }

    @Post('/auth')
    async auth(@Body() body: AuthDto){
        return this.registroService.auth(body)
    }
}
