import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Jornada } from "src/jornada/schema/jornada.schema";
import { Programa } from "src/programa/schema/programa.schema";

@Schema({timestamps: {
    currentTime: () => new Date(Date.now()-5*60*60*1000)
}})
export class Ficha{
    @Prop({
        unique: true,
        required: true,
        trim: true
    })
    codigo: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Programa', unique: false, required: true, trim: true})
    programa: Programa

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Jornada',required: false, trim: true})
    jornada: Jornada 
    
    @Prop({
        unique: false,
        required: false,
        trim: true,
    })
    fecha_inicio?: string;

    @Prop({
        unique: false,
        required: false,
        trim: true,
    })
    fecha_fin?: string;
}

export const FichaSchema = SchemaFactory.createForClass(Ficha)