import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({timestamps: false})
export class NumeroInforme{
    @Prop({
        required: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TipoInforme'
    })
    id: string;

    @Prop({
        required: true,
        trim: true,
        default: 0
    })
    numero: number;
}

export const NumeroInformeSchema = SchemaFactory.createForClass(NumeroInforme);