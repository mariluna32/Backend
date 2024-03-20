import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateConfigSistemaDto, UpdateConfigSistemaDto } from './dto/config_sistema.dto';
import { ConfigSistemaService } from './config_sistema.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Configuracion del sistema")
@Controller('config-sistema')
export class ConfigSistemaController {
    constructor(private readonly configSistemaService: ConfigSistemaService){}

    @Post("")
    async create(@Body() body: CreateConfigSistemaDto) {
        return this.configSistemaService.create(body);
    }

    @Get("")
    findAll(){
        return this.configSistemaService.findAll();
    }

    @Patch("/:id")
    update(@Param("id") id: string, @Body() body:UpdateConfigSistemaDto){
        return this.configSistemaService.update(id, body);
    }
}
