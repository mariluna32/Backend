import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { ObjectEstadoDTO } from "../dto/object-estados.dto";
import { ObjectDescripcionDTO } from "../dto/object-descripcion.dto";

@Schema({timestamps: {
    currentTime: () => new Date(Date.now()-5*60*60*1000)
}})
export class Implemento{
    @Prop({
        optional: true,
        trim: true,
    })
    codigo?: string;

    @Prop({
        required: true,
        trim: true,
    })
    nombre: string;

    @Prop({
        required: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Marca'
    })
    marca: string;
    
    @Prop({
        required: true,
        trim: true,
    })
    descripcion?: ObjectDescripcionDTO;
    
    @Prop({
        required: true,
        trim: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Categoria'
    })
    categoria: string[];
    
    @Prop({
        required: true,
        trim: true,
    })
    cantidad: number;

    @Prop({
        required: true,
        trim: true,
    })
    cantidad_prestados: number;

    @Prop({
        required: true,
        trim: true,
    })
    cantidad_disponible: number;
    
    @Prop({
        optional: true,
        trim: true,
    })
    img?: string;
    
    @Prop({
        required: true,
        trim: true,
        ref: 'EstadoImplementos'
    })
    estado: ObjectEstadoDTO[];
}

export const ImplementosSchema = SchemaFactory.createForClass(Implemento);