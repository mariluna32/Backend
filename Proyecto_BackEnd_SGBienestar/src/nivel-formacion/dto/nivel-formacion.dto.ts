import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateNivelDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el nombre del nivel de formacion"})
    readonly nombre: string;
}

export class UpdateNivelDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el nombre del nivel de formacion"})
    readonly nombre?: string;
}
