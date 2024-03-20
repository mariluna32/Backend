import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: false, versionKey: false})
export class eps{
    @Prop({
        unique: true,
        required: true,
        trim: true
    })
    nombre: string;
}


export const EpsSchema = SchemaFactory.createForClass(eps)