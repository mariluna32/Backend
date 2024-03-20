import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProgramaDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el codigo del programa"})
    readonly codigo?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la version del programa "})
    readonly version?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el nombre del programa "})
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el nivel del programa "})
    readonly nivel: string;
}

export class UpdateProgramaDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el codigo del programa"})
    readonly codigo?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "la version del programa "})
    readonly version?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el nombre del programa "})
    readonly nombre?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el nivel del programa "})
    readonly nivel?: string;
}