import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
    timestamps: false,
    versionKey: false
})
export class EstadoImplementos{
    @Prop({
        required: true,
        trim: true,
        unique: true
    })
    estado: string;
}

export const EstadoImplementosSchema = SchemaFactory.createForClass(EstadoImplementos);

/*@Schema({timestamps: {
    currentTime: () => new Date(Date.now()-5*60*60*1000)
}})
export class EstadoImplementos{
    @Prop({
        required: true,
        trim: true,
    })
    estado: string;

    @Prop({
        optional: true,
        trim: true,
        type: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'Implemento', default: null },
        ]
    })
    implementos: string[];
}

export const EstadoImplementosSchema = SchemaFactory.createForClass(EstadoImplementos);*/