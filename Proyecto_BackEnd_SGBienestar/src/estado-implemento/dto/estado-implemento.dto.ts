import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class CreateEstadoImplementoDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "Estado del implemento"})
    readonly estado: string;
}

export class UpdateEstadoImplementoDTO{
    @IsString()
    @IsOptional()
    readonly estado?: string;
}

/*export class CreateEstadoImplementoDTO{
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ description: "el estado del implemento"})
    readonly estado: string;
    @IsString()
    @IsOptional()
    @ApiProperty({ description: "el id del implemento"})
    readonly implementos?: string[];
}

export class UpdateEstadoImplementoDTO{
    @IsString()
    @IsOptional()
    readonly estado?: string;
    @IsString()
    @IsOptional()
    implementos?: string[];
}*/