import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EstadoImplementoService } from './estado-implemento.service';
import { CreateEstadoImplementoDTO, UpdateEstadoImplementoDTO } from './dto/estado-implemento.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Estado Implementos")
@Controller('estado-implemento')
export class EstadoImplementoController {
    constructor(private readonly estadoImplementoService: EstadoImplementoService){}

    @Get("")
    findAll(){
        return this.estadoImplementoService.findAll();
    }

    @Get("/id/:id")
    findOneById(@Param("id") id: string){
        return this.estadoImplementoService.findOneById(id);    
    }

    @Get("/implementos/estado/:id")
    findImplementosByEstado(@Param("id") id: string){
        return this.estadoImplementoService.findImplementosByEstado(id);    
    }

    @Post()
    async create(@Body() body: CreateEstadoImplementoDTO) {
        return this.estadoImplementoService.create(body);
    }

    @Delete("/:id")
    delete(@Param("id") id: string){
        return this.estadoImplementoService.delete(id);
    }

    @Put("/:id")
    update(@Param("id") id: string, @Body() body:UpdateEstadoImplementoDTO){
        return this.estadoImplementoService.update(id, body);
    }

}
