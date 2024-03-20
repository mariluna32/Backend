import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ObjectEstadoDTO } from "./object-estados.dto";
import { ObjectDescripcionDTO } from "./object-descripcion.dto";

export class CreateImplementoDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el codigo del implemento"})
    readonly codigo?: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el nombre del implemento"})
    readonly nombre: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "la marca del implemento"})
    readonly marca: string;
    @IsNotEmpty()
    @ApiProperty({
        type: ObjectDescripcionDTO,
        description: "Objeto de descripcion del implemento",
        default: {}
    })
    readonly descripcion: ObjectDescripcionDTO;
    @IsArray()
    @IsNotEmpty()
    @ApiProperty({ description: "la categoria del implemento"})
    readonly categoria: string[];
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: "la cantidad del implemento"})
    cantidad: number;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "imagen del implemento"})
    readonly img?: string;

    @IsNotEmpty()
    @ApiProperty({
        type: [ObjectEstadoDTO],
        description: "Arreglo de objetos de estado del implemento",
        default: []
    })
    readonly estado: ObjectEstadoDTO[];
}

export class UpdateImplementoDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el codigo del implemento"})
    readonly codigo?: string;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el nombre del implemento"})
    readonly nombre?: string;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la marca del implemento"})
    readonly marca?: string;
    @IsOptional()
    @ApiProperty({
        type: ObjectDescripcionDTO,
        description: "Objeto de descripcion del implemento",
        default: {}
    })
    readonly descripcion?: ObjectDescripcionDTO;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la categoria del implemento"})
    readonly categoria?: string[];
    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: "la cantidad del implemento"})
    readonly cantidad?: number;
    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: "la cantidad de implementos prestados"})
    readonly cantidad_prestados?: number;
    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: "la cantidad de implementos disponibles"})
    readonly cantidad_disponible?: number;
    @IsString()
    @IsOptional()
    readonly img?: string;
    @IsOptional()
    @ApiProperty({
        type: [ObjectEstadoDTO],
        description: "Arreglo de objetos de estado del implemento"
    })
    readonly estado?: ObjectEstadoDTO[];
}

/*export class CreateImplementoDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el codigo del implemento"})
    readonly codigo?: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el nombre del implemento"})
    readonly nombre: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "la marca del implemento"})
    readonly marca: string;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la descripcion del implemento"})
    readonly descripcion?: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "la categoria del implemento"})
    readonly categoria: string[];
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: "la cantidad del implemento"})
    readonly cantidad: number;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "imagen del implemento"})
    readonly img?: string;
}

export class UpdateImplementoDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el codigo del implemento"})
    readonly codigo?: string;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el nombre del implemento"})
    readonly nombre?: string;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la marca del implemento"})
    readonly marca?: string;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la descripcion del implemento"})
    readonly descripcion?: string;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la categoria del implemento"})
    readonly categoria?: string[];
    @IsNumber()
    @IsOptional()
    @ApiProperty({ description: "la cantidad del implemento"})
    readonly cantidad?: number;
    @IsString()
    @IsOptional()
    readonly img?: string;
}*/