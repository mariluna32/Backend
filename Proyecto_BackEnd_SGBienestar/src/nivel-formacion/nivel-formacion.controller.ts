import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NivelFormacionService } from './nivel-formacion.service';
import { CreateNivelDTO, UpdateNivelDTO } from './dto/nivel-formacion.dto';

@ApiTags("Nivel-Formacion")
@Controller('nivel-formacion')
export class NivelFormacionController {
    constructor(private readonly nivelService: NivelFormacionService){}

    @Get("/nivel")
    findAll(){
        return this.nivelService.findAll();
    }

    @Get("/nivel/:id")
    findOneById(@Param("id") id?: string){
        return this.nivelService.findOneById(id);    
    }

    @Post()
    async create(@Body() body: CreateNivelDTO) {
        return this.nivelService.create(body);
    }

    @Delete("/nivel/:id")
    delete(@Param("id") id: string){
        return this.nivelService.delete(id);
    }

    @Put("/nivel/:id")
    update(@Param("id") id: string, @Body() body:UpdateNivelDTO){
        return this.nivelService.update(id, body);
    }
}
