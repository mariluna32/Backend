import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({timestamps: {
    currentTime: () => new Date(Date.now()-5*60*60*1000)
}})
export class Programa{
    @Prop({
        unique: false,
        required: false,
        trim: true,
    })
    codigo?: string;

    @Prop({
        unique: false,
        required: false,
        trim: true,
    })
    version?: string;

    @Prop({
        unique: false,
        required: true,
        trim: true,
    })
    nombre: string;

    @Prop({
        unique: false,
        required: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'NivelFormacion'
    })
    nivel: string;

 
}

export const ProgramaSchema = SchemaFactory.createForClass(Programa);