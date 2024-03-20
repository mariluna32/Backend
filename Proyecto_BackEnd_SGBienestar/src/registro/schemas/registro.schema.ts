import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: {
    currentTime: () => new Date(Date.now()-5*60*60*1000)
}})
export class Usuarios{
    @Prop({
        required: true,
        trim: true,
    })
    nombres: string;

    @Prop({
        required: true,
        trim: true,
    })
    apellidos: string;

    @Prop({
        required: true,
        trim: true,
    })
    tipo_doc: string;
    
    @Prop({
        unique: true,
        required: true,
        trim: true,
    })
    n_doc: string;
    
    @Prop({
        required: true,
        trim: true,
    })
    telefono: string;
    
    @Prop({
        unique: true,
        required: true,
        trim: true,
    })
    correo_inst: string;
    
    @Prop({
        optional: true,
        trim: true,
    })
    correo_pers?: string;
    
    @Prop({
        optional: true,
        trim: true,
    })
    nacimiento?: string;
    
    @Prop({
        required: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rol'
    })
    rol: string;
    
    @Prop({
        required: true,
        trim: true,
        select: false
    })
    contrasena: string;
    
    @Prop({
        optional: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ficha'
    })
    ficha?: string;
    
    @Prop({
        required: true,
        trim: true,
    })
    direccion: string;
    
    @Prop({
        optional: true,
        trim: true,
    })
    rh?: string;
    
    @Prop({
        required: true,
        trim: true,
    })
    genero: string;
    
    @Prop({
        optional: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'eps'
    })
    eps?: string;
    
    @Prop({
        required: true,
        trim: true,
    })
    pps: boolean;

    @Prop({
        optional: true,
        trim: true,
        default: ""
    })
    token?: string;

    @Prop({
        optional: true,
        trim: true,
        default: false
    })
    activacion: boolean;

    @Prop({
        optional: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prestamos'
    })
    prestamos: string[];

    @Prop({
        optional: true,
        type: mongoose.Schema.Types.ObjectId
    })
    sanciones: string[];

    @Prop({
        optional: true,
        trim: true
    })
    codigo: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuarios);