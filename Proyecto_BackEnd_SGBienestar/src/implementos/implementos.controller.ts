import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ImplementosService } from './implementos.service';
import { CreateImplementoDTO, UpdateImplementoDTO } from './dto/implementos.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Implemento")
@Controller('implementos')
export class ImplementosController {
    constructor(private readonly implementoService: ImplementosService){}

    @Get("")
    findAll(){
        return this.implementoService.findAll();
    }

    @Get("/id/:id")
    findOneById(@Param("id") id: string){
        return this.implementoService.findOneById(id);    
    }

    @Get("/categoria/:id")
    findByCategoria(@Param("id") id: string){
        return this.implementoService.findByCategoria(id);    
    }

    @Get("/estado/:id")
    findByEstado(@Param("id") id: string){
        return this.implementoService.findByEstado(id);    
    }

    @Post()
    async create(@Body() body: CreateImplementoDTO) {
        return this.implementoService.create(body);
    }

    /*@Post("/estado-implemento/:id")
    async create(@Param("id") id: string, @Body() body: CreateImplementoDTO) {
        //return this.implementoService.create(id, body);
    }*/

    @Patch("/:id")
    update(@Param("id") id: string, @Body() body:UpdateImplementoDTO){
        return this.implementoService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.implementoService.delete(id);
    }

    @Get('ReinicioImplementos')
    async reinicioImplementos(){
        return this.implementoService.reinicioImplementos();
    }
}
