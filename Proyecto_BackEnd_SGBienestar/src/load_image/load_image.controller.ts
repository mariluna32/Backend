import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateImageDto } from './dto/load_image.dto';
import { LoadImageService } from './load_image.service';
import { MulterFile } from 'multer'; 
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Cargar Imagenes")
@Controller('load-image')
export class LoadImageController {
    constructor(private readonly loadImageService: LoadImageService) {}

    @Post('upload')
    @UseInterceptors(FilesInterceptor('image'))
    async uploadImage(@UploadedFiles() file: MulterFile[], @Body() createImageDto: CreateImageDto){
        return await this.loadImageService.uploadImage(createImageDto, file);
    }

    @Get('listar')
    async getAllImages(){
        return await this.loadImageService.getAllImages();
    }

    @Get('image/:id')
    async getImageById(@Param('id') id: string){
        return await this.loadImageService.getImageById(id);
    }

    @Patch('renombrar/:id')
    async renameImage(@Param('id') id: string, @Body() createImageDto: CreateImageDto){
        return await this.loadImageService.renameImage(id, createImageDto);
    }

    @Delete('eliminar/:id')
    async deleteImage(@Param('id') id: string){
        return await this.loadImageService.deleteImage(id)
    }
}
