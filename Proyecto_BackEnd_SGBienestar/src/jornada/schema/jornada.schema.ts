import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: false, versionKey: false})
export class Jornada{
    @Prop({
        unique: true,
        required: true,
        trim: true
    })
    nombre: string
}

export const JornadaModel = SchemaFactory.createForClass(Jornada)