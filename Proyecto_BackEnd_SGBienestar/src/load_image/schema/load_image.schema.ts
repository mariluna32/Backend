import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps: false, versionKey: false})
export class Image{
    @Prop({
        required: true,
        trim: true,
        default: ''
    })
    filename: string

    @Prop({
        required: true,
        trim: true,
        default: '',
        select: false
    })
    path: string

    @Prop({
        required: true,
        trim: true,
        default: '',
    })
    src: string

    @Prop({
        required: true,
        trim: true,
        default: 0
    })
    size: number;
}

export const ImageSchema = SchemaFactory.createForClass(Image);