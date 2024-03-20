import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: {
    currentTime: () => new Date(Date.now()-5*60*60*1000)
}})
export class NivelFormacion{
    @Prop({
        unique: true,
        required: true,
        trim: true,
    })
    nombre: string;
}

export const NivelFormacionSchema = SchemaFactory.createForClass(NivelFormacion);