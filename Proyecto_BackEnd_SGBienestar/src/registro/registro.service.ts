import { Injectable, Inject, HttpStatus, HttpException, Body, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRegistroDTO, UpdateRegistroDTO } from 'src/registro/dto/registro.dto';
import { Usuarios } from 'src/registro/schemas/registro.schema';
import { Types } from 'mongoose';
import { MENSAJES_CORREO, MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import * as jwt from "jsonwebtoken"
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RolService } from 'src/rol/rol.service';
import { Rol } from 'src/rol/schema/rol.schema';
import { AuthDto } from './dto/auth.dto';
import { Solicitud } from './dto/solicitud.dto';
import { ResetPasswordDto } from './dto/resetpass.dto';
import { RegistroGuard } from 'src/guards/registro.guard';
import { Sancion } from 'src/sanciones/schema/sanciones.schema';

@Injectable()
//@UseGuards(RegistroGuard,UseGuards)
export class RegistroService {
    constructor(@InjectModel(Usuarios.name) private registroModel: Model<Usuarios>,
    @Inject(MailService)readonly mailService: MailService,
    @InjectModel(Rol.name) readonly rolModel: Model<Rol>,
    @InjectModel(Sancion.name) private sancionModel: Model<Sancion>) {}
 

    findAll(){
        return this.registroModel.find();
    }

    findAllUsers(){
        return this.registroModel.find({}, {nombres: 1, apellidos: 1, correo_inst: 1, rol: 1, ficha: 1, n_doc: 1} ).populate('rol').populate({path: 'ficha', populate: {path: 'programa'}}).populate('eps');
    }

    findAllUsersWithPrestamos_Sanciones(){
        return this.registroModel.find({}, {nombres: 1, apellidos: 1, correo_inst: 1, rol: 1, ficha: 1, n_doc: 1,prestamos:1} ).populate('rol').populate({path: 'ficha', populate: {path: 'programa'}}).populate({path: 'prestamos',populate: [{ path: 'estado' }, { path: 'implementos', populate:{path: 'marca'} }] });
    }


    async login(login: LoginDto) {
        const user = await this.registroModel.findOne({correo_inst: login.correo_inst}).select('+contrasena');
        const sanciones = await this.sancionModel.find();
        const sanciones_Usuario = sanciones.filter((sancion) => sancion.usuario.toString() === user._id.toString())
        const sancionActiva = sanciones_Usuario.map((sancion) => sancion.estado)
        let sancionToken = false
        for(let i=0;i<sancionActiva.length;i++){
            if(sancionActiva[i] == true){
                sancionToken = true
            }
        }
        
        if (!user) throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.NOT_FOUND);
        if(!user.activacion) throw new HttpException(MENSAJES_ERROR.CUENTA_NO_ACTIVADA, HttpStatus.NOT_ACCEPTABLE)
        const passwordMatch = await bcrypt.compare(login.contrasena, user.contrasena);
        if (!passwordMatch) throw new HttpException(MENSAJES_ERROR.CREDENCIALES_INVALIDAS, HttpStatus.UNAUTHORIZED);
        const fechaSesion = Date.now()
        const roles  = await this.rolModel.find()
        const rolesNombre = roles.find(id => id._id.toString() === user.rol.toString())
        const payload = {id: user._id, nombre:user.nombres, apellidos: user.apellidos, correo_inst: user.correo_inst, rol: rolesNombre.nombre, privilegio: rolesNombre.privilegio, fecha: fechaSesion, n_doc: user.n_doc, sanciones: sancionToken}
        const token = this.generateToken(payload)
        await this.registroModel.findOneAndUpdate(user._id, { token: token });
        
        if (passwordMatch) {
            return {token: token}
        } else {
            throw new HttpException(MENSAJES_ERROR.CREDENCIALES_INVALIDAS, HttpStatus.UNAUTHORIZED);
        }   
    }
    async solicitudCambioContrasena(correo: Solicitud) {
        try {
            const user = await this.registroModel.findOne({ correo_inst: correo.correo }).select('+contrasena')
            if (!user) {
                throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.NOT_FOUND)
            }
            const resetCode = this.generarContraseña()
            const hashedPassword = await bcrypt.hash(resetCode, 8);
            user.contrasena = hashedPassword;
            console.log(user.contrasena)
            await user.save();
            this.mailService.makeMail({ correo: [user.correo_inst], asunto: "Solicitud Cambio de contraseña", mensaje: MENSAJES_CORREO.RECUPERACION_CONTRASENA + `<!DOCTYPE html>
            <html>
            <head>
                <title>Servicio Nacional de Aprendizaje</title>
            </head>
            <body>
                <table align="center" width="600" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td bgcolor="#f2f2f2" style="padding: 20px; text-align: center;">
                            <h1 style="color: #000000;">Servicio Nacional de Aprendizaje</h1>
                            <p style="color: #000000;">Hola, ${user.nombres}</p>
                            <p style="color: #000000;">Recibimos una solicitud para restablecer tu contraseña de (nombre-app).</p>
                            <p style="color: #000000;">Ingresa el siguiente código para restablecer la contraseña:</p>
                            <p class="codigo" style="background-color: #ffffff; padding: 10px; font-size: 18px;">${resetCode}</p>
                            <p></p>
                            <p style="color: #000000;">Atentamente, Equipo de Bienestar.</p>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            
            ` },)
            throw new HttpException(MENSAJES_OK.CORREO_ENVIADO, HttpStatus.ACCEPTED)
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.CORREO_NO_ENVIADO, HttpStatus.NOT_ACCEPTABLE), error
        }
    }
    async resetPassword(dto: ResetPasswordDto) {
        const user = await this.registroModel.findOne({
            correo_inst: dto.correo
        }).select('+contrasena');

        if (!user) {
            throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.BAD_REQUEST);
        }
        const passwordMatch = await bcrypt.compare(dto.codigo, user.contrasena);
        if (!passwordMatch) throw new HttpException(MENSAJES_ERROR.CODIGO_NO_VALIDO, HttpStatus.UNAUTHORIZED)
        const hashedPassword = await bcrypt.hash(dto.newPassword, 8);
        user.contrasena = hashedPassword;
        await user.save();
        throw new HttpException(MENSAJES_OK.CAMBIO_CONTRASEÑA_EXISTOSO, HttpStatus.ACCEPTED)
    }


    async auth(codigo:  AuthDto) {
        try {
            const user = await this.registroModel.findOne({ codigo: codigo.codigo })
            if (!user) {
                throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.NOT_ACCEPTABLE)
            }
            const body: UpdateRegistroDTO = new UpdateRegistroDTO();
            body.activacion = true
            
            await this.registroModel.findOneAndUpdate({ _id: user._id }, body);
            throw new HttpException(MENSAJES_OK.ACTIVACION, HttpStatus.ACCEPTED)
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.TOKEN_INVALIDO, HttpStatus.BAD_REQUEST), error
        }
    }
    async findOneById(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.registroModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            return found;
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_USUARIO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }        
    }

    async findOneByToken(token: string){
        try {
            const found = await this.registroModel.findOne({token: token});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            if(found.activacion){
                return new HttpException(MENSAJES_ERROR.ACTIVACION, HttpStatus.BAD_REQUEST);
            }
            const body: UpdateRegistroDTO = new UpdateRegistroDTO();
            body.activacion = true;
            await this.update(found._id.toString(), body);
            return new HttpException(MENSAJES_OK.ACTIVACION, HttpStatus.OK);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.TOKEN_INVALIDO, HttpStatus.NOT_ACCEPTABLE);
        }        
    }

    async findOneByMail(mail: string){
        const found = await this.registroModel.findOne({correo_inst: mail});
        return found;
    }

    async create(usuario: CreateRegistroDTO) {
        const found = await this.registroModel.findOne({
            $or: [
                { correo_inst: usuario.correo_inst },
                { n_doc: usuario.n_doc }
            ]
        });
        if (found) {
            throw new HttpException(MENSAJES_ERROR.USUARIO_EXISTE, HttpStatus.CONFLICT);
        }
        usuario.codigo = this.generateCodigo();
        const roles  = await this.rolModel.find()
        const rolesNombre = roles.find(id => id._id.toString() === usuario.rol.toString())
        const payload = {nombre:usuario.nombres, apellidos: usuario.apellidos, correo_inst: usuario.correo_inst, rol: rolesNombre.nombre, privilegio: rolesNombre.privilegio , codigo: usuario.codigo, n_doc: usuario.n_doc}
        usuario.token = this.generateToken(payload) 
        const newRegistro = new this.registroModel(usuario);
        await newRegistro.save();

        // ENVIAR MAIL de activacion de cuenta --------------------------------
        this.mailService.makeMail({
            correo: [usuario.correo_inst], asunto: "Activacion de cuenta", mensaje: 
                    `
                    <html>
                    <head>
                        <title>Servicio Nacional de Aprendizaje</title>
                    </head>
                    <body>
                        <table align="center" width="600" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td bgcolor="#f2f2f2" style="padding: 20px; text-align: center;">
                                <h1 style="color: #000000;">Servicio Nacional de Aprendizaje</h1>
                                    <p style="color: #000000;">Estimado usuario, para completar el proceso de registro en (nombre) es necesario confirmar tu dirección de correo electrónico institucional. Para ello, te entregamos un código de autenticación.</p>
                                    <p style="color: #000000;">Una vez realizada la confirmación podrás acceder a todas las funciones y características de nuestra plataforma.</p>
                                    <p style="color: #000000;">Si no has realizado este registro, por favor ignora este correo.</p>
                                    <p style="color: #000000;">¡Es un placer tenerte como parte de nuestra comunidad!</p>
                                    <p style="color: #000000;">Ingresa el siguiente código para verificar tu cuenta:</p>
                                    <p class="codigo" style="background-color: #ffffff; padding: 10px; font-size: 18px;">${usuario.codigo}</p>
                                    <p></p>
                                    <p style="color: #000000;">Atentamente, Equipo de Bienestar.</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>
                    

            `},);

        throw new HttpException(MENSAJES_OK.USUARIO_CREADO, HttpStatus.ACCEPTED);
    }

    generateToken = (data: any): string => {
        const Key = 'SistemaGestionBienestar2023_2712267*';
        const token = jwt.sign(data, Key/*, { expiresIn: null }*/);        
        return token;
    };

    generateCodigo = (): string => {
        const codigo = `${Math.floor(Math.random() * 100000) + 100000}`
        return codigo;
    };

    generarContraseña = (): string => {
        const caracteresMinusculas = "abcdefghijklmnopqrstuvwxyz";
        const caracteresMayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const caracteresNumeros = "0123456789";
        const caracteresEspeciales = "!@#$%^&*()_-+=<>?";
    
        const todasLasCategorias = [
            caracteresMinusculas,
            caracteresMayusculas,
            caracteresNumeros,
            caracteresEspeciales
        ];
    
        let contraseña = "";
    
        for (const categoria of todasLasCategorias) {
            const caracterAleatorio = categoria.charAt(Math.floor(Math.random() * categoria.length));
            contraseña += caracterAleatorio;
        }

        const caracteresRestantes = caracteresMinusculas + caracteresMayusculas + caracteresNumeros + caracteresEspeciales;

        while (contraseña.length < 8) {
            const caracterAleatorio = caracteresRestantes.charAt(Math.floor(Math.random() * caracteresRestantes.length));
            contraseña += caracterAleatorio;
        }
    
        contraseña = contraseña.split('').sort(() => Math.random() - 0.5).join('');
    
        return contraseña;
    }
    
    async delete(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.registroModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.registroModel.findByIdAndDelete(id);
            return new HttpException(MENSAJES_OK.USUARIO_ELIMINADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_USUARIO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    async update(id: string, registro: UpdateRegistroDTO){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.registroModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.registroModel.findByIdAndUpdate(id, registro, {new:true});
            return new HttpException(MENSAJES_OK.USUARIO_ACTUALIZADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_USUARIO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
