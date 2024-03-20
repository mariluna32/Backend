import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateImageDto {
    @IsString()
    @IsOptional()
    filename: string;
}