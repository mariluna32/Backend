import { HttpException, HttpStatus, Inject, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateInformeDTO } from './dto/informe.dto';

import * as fs from 'fs';
import * as xlsx from 'xlsx-populate';
import { Model, Types } from 'mongoose';
import { TipoInforme } from 'src/tipo-informe/schema/tipo-informe.schema';
import { Usuarios } from 'src/registro/schemas/registro.schema';
import { Implemento } from 'src/implementos/schema/implementos.schema';
import { Sancion } from 'src/sanciones/schema/sanciones.schema';
import { TipoInformeService } from 'src/tipo-informe/tipo-informe.service';
import { Informe } from './schema/informe.schema';
import { PATH_ABSOLUTA_INFORME } from 'src/StringValues';


@Injectable()
export class InformeService {
    constructor(@InjectModel(Informe.name) private informeModel: Model<Informe>,
                @InjectModel(TipoInforme.name) private tipoInformeModel: Model<TipoInforme>,
               @InjectModel(Usuarios.name) private usuarioModel: Model<Usuarios>,
               @InjectModel(Implemento.name) private implementoModel: Model<Implemento>,
               @InjectModel(Sancion.name) private sancionModel: Model<Sancion>,
               @Inject(TipoInformeService)readonly tipoInformeService: TipoInformeService) {

                this.createFolder();
                
               }


    async create(createInformeDto: CreateInformeDTO) {
        try {
            let objId = new Types.ObjectId(createInformeDto.tipo_informe);
            const tipo_informe = await this.tipoInformeModel.findOne({ _id: objId });      
            if (!tipo_informe) {
                return 'ERROR: Tipo de informe invalido'
            }

            objId = new Types.ObjectId(createInformeDto.usuario);
            const usuario = await this.usuarioModel.findOne({ _id: objId });      
            if (!usuario) {
                return 'ERROR: Usuario Invalido'
            }

            const fecha = this.getDate();

            if(tipo_informe.nombre === 'Informe de Nuevo Implemento'){
                try {
                    const informesFolder = PATH_ABSOLUTA_INFORME + 'informes/';

                    const plantillaPath = PATH_ABSOLUTA_INFORME + 'plantillas/' + 'nuevos_implementos.xlsx';//'./src/informe/plantillas/nuevos_implementos.xlsx';
                    const nombreInforme = tipo_informe.nombre + ' ' + fecha.replaceAll('/', '_').replaceAll(':', '_').replaceAll('.', '_') + '.xlsx';
                    const informePath = informesFolder + nombreInforme;//'./src/informe/informes/' + nombreInforme;       
                    const informePdfPath = informesFolder + 'pdf/' + nombreInforme.replaceAll('.xlsx', '.pdf');   
                    await fs.promises.copyFile(plantillaPath, informePath);     

        
                    try {
                        const workbook = await xlsx.fromFileAsync(informePath);
                        const sheet = workbook.sheet(0);
                        sheet.cell('A5').value(tipo_informe.nombre.toUpperCase());
                        sheet.cell('H6').value(tipo_informe.numero + 1);
                        sheet.cell('G7').value(fecha);
                        sheet.cell('E9').value(usuario.nombres + ' ' + usuario.apellidos);
                        sheet.cell('E10').value(usuario.n_doc);
                        sheet.cell('E11').value(createInformeDto.dependencia);

                        let filas = [];
                        createInformeDto.implemento.forEach((implemento, index) => {
                            sheet.cell('A' + (16 + index)).value(index + 1);
                            sheet.cell('B' + (16 + index)).value(implemento.nombre);
                            sheet.cell('F' + (16 + index)).value(implemento.cantidad);
                            sheet.cell('G' + (16 + index)).value(implemento.caracteristicas);
                            filas.push([(index + 1), implemento.nombre, implemento.cantidad, implemento.caracteristicas]);
                        });

                        await workbook.toFileAsync(informePath);


                        const columnas = ['N.', 'NOMBRE DEL IMPLEMENTO', 'CANTIDAD', 'CARACTERISTICAS'];
                        const tamanoColumna = [30, 270, 50, 200]
                        this.createPDF(nombreInforme, tipo_informe.nombre.toUpperCase(),{
                            numero: (tipo_informe.numero + 1),
                            fecha: fecha,
                            nombre: usuario.nombres + ' ' + usuario.apellidos,
                            documento: usuario.n_doc,
                            dependencia: createInformeDto.dependencia,
                            observaciones: createInformeDto.observaciones
                          }, columnas, tamanoColumna, filas, 'V');


                        this.updateNumInforme(createInformeDto.tipo_informe, tipo_informe.nombre, tipo_informe.numero + 1);


                        await new this.informeModel({
                            nombre: nombreInforme.replaceAll('.xlsx', ''),
                            fecha: fecha,
                            numero: (tipo_informe.numero + 1),
                            pathPdf: informePdfPath,
                            pathXlsx: informePath
                        }).save();

                        return {
                            path: informePdfPath,
                            nombre: nombreInforme.replaceAll('.xlsx', '')
                        };
                        
                        return { message: 'Archivo XLSX actualizado correctamente' };
                    } catch (error) {
                        console.log(error);
                        return { error: 'Error al actualizar el archivo XLSX', details: error };
                    }        
                } catch (error) {
                    return 'Error al copiar el archivo: ' + error;
                }
            }else if(tipo_informe.nombre === 'Informe de Inventario'){
                try {
                    let implementos = null; 
                    if(createInformeDto.estado_implemento.length > 0){
                        objId = new Types.ObjectId(createInformeDto.usuario);
                        implementos = await this.implementoModel.find({ _id: objId })
                        .populate('marca')
                        .populate('categoria')
                        .populate('estado.estado');
                    }else{
                        implementos = await this.implementoModel.find()
                        .populate('marca')
                        .populate('categoria')
                        .populate('estado.estado');
                    }                    
                         
                    if (!implementos) {
                        return null
                    }

                    const informesFolder = PATH_ABSOLUTA_INFORME + 'informes/';

                    const plantillaPath = PATH_ABSOLUTA_INFORME + 'plantillas/' + 'inventario.xlsx';//'./src/informe/plantillas/inventario.xlsx';
                    const nombreInforme = tipo_informe.nombre + ' ' + fecha.replaceAll('/', '_').replaceAll(':', '_').replaceAll('.', '_') + '.xlsx';
                    const informePath = informesFolder + nombreInforme;//'./src/informe/informes/' + nombreInforme;        
                    const informePdfPath = informesFolder + 'pdf/' + nombreInforme.replaceAll('.xlsx', '.pdf');          
                    await fs.promises.copyFile(plantillaPath, informePath); 
                    try {
                        const workbook = await xlsx.fromFileAsync(informePath);
                        const sheet = workbook.sheet(0);
                        sheet.cell('A5').value(tipo_informe.nombre.toUpperCase());
                        sheet.cell('I6').value(tipo_informe.numero + 1);
                        sheet.cell('H7').value(fecha);
                        sheet.cell('F9').value(usuario.nombres + ' ' + usuario.apellidos);
                        sheet.cell('F10').value(usuario.n_doc);
                        sheet.cell('F11').value(createInformeDto.dependencia);

                        let fila = [];
                        implementos.forEach((implemento, index) => {
                            sheet.cell('A' + (16 + index)).value(index + 1);
                            sheet.cell('B' + (16 + index)).value(implemento.nombre);
                            sheet.cell('E' + (16 + index)).value(implemento.cantidad);
                            let categorias = '';
                            implemento.categoria.forEach((cat, index) =>{
                                categorias += cat.nombre + ', ';
                            });                            

                            let caracteristicas = '';
                            for (var clave in implemento.descripcion) {
                                if (implemento.descripcion.hasOwnProperty(clave)) {
                                    var valor = implemento.descripcion[clave];
                                    caracteristicas += clave + ': ' + valor + ', '
                                }
                            }

                            sheet.cell('F' + (16 + index)).value(caracteristicas.substring(0, (caracteristicas.length-2)));

                            let estados = '';
                            implemento.estado.forEach((est, index) =>{
                                estados += est.estado[0].estado + ', ';
                            });
                            sheet.cell('H' + (16 + index)).value(estados.substring(0, (estados.length-2)));
                            fila.push([(index + 1), implemento.nombre, implemento.cantidad, caracteristicas.substring(0, (caracteristicas.length-2)), estados.substring(0, (estados.length-2))]);
                        });

                        await workbook.toFileAsync(informePath);


                        const columnas = ['N.', 'IMPLEMENTOS', 'CANTIDAD', 'CARACTERISTICAS', 'ESTADO'];
                        const tamanoColumna = [30, 240, 50, 150, 80]; // 550
                        this.createPDF(nombreInforme, tipo_informe.nombre.toUpperCase(),{
                            numero: (tipo_informe.numero + 1),
                            fecha: fecha,
                            nombre: usuario.nombres + ' ' + usuario.apellidos,
                            documento: usuario.n_doc,
                            dependencia: createInformeDto.dependencia,
                            observaciones: createInformeDto.observaciones
                          }, columnas, tamanoColumna, fila, 'V');


                        this.updateNumInforme(createInformeDto.tipo_informe, tipo_informe.nombre, tipo_informe.numero + 1);



                        await new this.informeModel({
                            nombre: nombreInforme.replaceAll('.xlsx', ''),
                            fecha: fecha,
                            numero: (tipo_informe.numero + 1),
                            pathPdf: informePdfPath,
                            pathXlsx: informePath
                        }).save();

                        return {
                            path: informePdfPath,
                            nombre: nombreInforme.replaceAll('.xlsx', '')
                        };
                        
                        return { message: 'Archivo XLSX actualizado correctamente' };
                    } catch (error) {
                        console.log(error);
                        return { error: 'Error al actualizar el archivo XLSX', details: error };
                    }        
                } catch (error) {
                    return 'Error al copiar el archivo: ' + error;
                }
            }else if(tipo_informe.nombre === 'Informe de Usuario'){
                const usuarios = await this.usuarioModel.find().populate('ficha');
                if (!usuarios) {
                    return null
                }

                //return usuarios;
                
                try {
                    const informesFolder = PATH_ABSOLUTA_INFORME + 'informes/';

                    const plantillaPath = PATH_ABSOLUTA_INFORME + 'plantillas/' + 'usuarios.xlsx';//'./src/informe/plantillas/usuarios.xlsx';
                    const nombreInforme = tipo_informe.nombre + ' ' + fecha.replaceAll('/', '_').replaceAll(':', '_').replaceAll('.', '_') + '.xlsx';
                    const informePath = informesFolder + nombreInforme;//'./src/informe/informes/' + nombreInforme;        
                    const informePdfPath = informesFolder + 'pdf/' + nombreInforme.replaceAll('.xlsx', '.pdf');          
                    await fs.promises.copyFile(plantillaPath, informePath);
        
                    try {
                        const workbook = await xlsx.fromFileAsync(informePath);
                        const sheet = workbook.sheet(0);
                        sheet.cell('A5').value(tipo_informe.nombre.toUpperCase());
                        sheet.cell('I6').value(tipo_informe.numero + 1);
                        sheet.cell('H7').value(fecha);
                        sheet.cell('F9').value(usuario.nombres + ' ' + usuario.apellidos);
                        sheet.cell('F10').value(usuario.n_doc);
                        sheet.cell('F11').value(createInformeDto.dependencia);


                        let filas = [];
                        usuarios.forEach((usr, index) => {
                            const ficha = usr.ficha;                                                        
                            sheet.cell('A' + (16 + index)).value(index + 1);
                            if(ficha){
                                sheet.cell('B' + (16 + index)).value(ficha['codigo']);
                                filas.push([(index + 1), ficha['codigo'], usr.nombres + ' ' + usr.apellidos, usr.n_doc, usr.correo_inst, usr.telefono]);
                            }else{
                                filas.push([(index + 1), '', usr.nombres + ' ' + usr.apellidos, usr.n_doc, usr.correo_inst, usr.telefono]);
                            }                         
                            sheet.cell('C' + (16 + index)).value(usr.nombres + ' ' + usr.apellidos);
                            sheet.cell('E' + (16 + index)).value(usr.n_doc);
                            sheet.cell('G' + (16 + index)).value(usr.correo_inst);
                            sheet.cell('I' + (16 + index)).value(usr.telefono);                            
                        });

                        await workbook.toFileAsync(informePath);
                        
                        
                        const columnas = ['N.', 'N. FICHA', 'NOMBRES', 'N. DOCUMENTO', 'CORREO', 'TELEFONO'];
                        const tamanoColumna = [30, 70, 120, 80, 150, 100]; // 550
                        this.createPDF(nombreInforme, tipo_informe.nombre.toUpperCase(),{
                            numero: (tipo_informe.numero + 1),
                            fecha: fecha,
                            nombre: usuario.nombres + ' ' + usuario.apellidos,
                            documento: usuario.n_doc,
                            dependencia: createInformeDto.dependencia,
                            observaciones: createInformeDto.observaciones
                          }, columnas, tamanoColumna, filas, 'V');


                        this.updateNumInforme(createInformeDto.tipo_informe, tipo_informe.nombre, tipo_informe.numero + 1);

                        await new this.informeModel({
                            nombre: nombreInforme.replaceAll('.xlsx', ''),
                            fecha: fecha,
                            numero: (tipo_informe.numero + 1),
                            pathPdf: informePdfPath,
                            pathXlsx: informePath
                        }).save();

                        return {
                            path: informePdfPath,
                            nombre: nombreInforme.replaceAll('.xlsx', '')
                        };

                        return { message: 'Archivo XLSX actualizado correctamente' };
                    } catch (error) {
                        console.log(error);
                        return { error: 'Error al actualizar el archivo XLSX', details: error };
                    }        
                } catch (error) {
                    return 'Error al copiar el archivo: ' + error;
                }

            }else if(tipo_informe.nombre === 'Informe de Sanciones'){
                const estado = createInformeDto.estado;
                let sanciones = null;
                if(estado === 'Activo'){
                    sanciones = await this.sancionModel.find({estado: true}).populate('usuario');
                }else if(estado === 'Inactivo'){
                    sanciones = await this.sancionModel.find({estado: false}).populate('usuario');
                }else{
                    sanciones = await this.sancionModel.find().populate('usuario');
                }
                //return sanciones;

                try {
                    const informesFolder = PATH_ABSOLUTA_INFORME + 'informes/';

                    const plantillaPath = PATH_ABSOLUTA_INFORME + 'plantillas/' + 'sanciones.xlsx';//'./src/informe/plantillas/sanciones.xlsx';
                    const nombreInforme = tipo_informe.nombre + ' ' + fecha.replaceAll('/', '_').replaceAll(':', '_').replaceAll('.', '_') + '.xlsx';
                    const informePath = informesFolder + nombreInforme;//'./src/informe/informes/' + nombreInforme;      
                    const informePdfPath = informesFolder + 'pdf/' + nombreInforme.replaceAll('.xlsx', '.pdf');   
                    await fs.promises.copyFile(plantillaPath, informePath);
        
                    try {
                        const workbook = await xlsx.fromFileAsync(informePath);
                        const sheet = workbook.sheet(0);
                        sheet.cell('A5').value(tipo_informe.nombre.toUpperCase());
                        sheet.cell('J6').value(tipo_informe.numero + 1);
                        sheet.cell('J7').value(fecha);
                        sheet.cell('H9').value(usuario.nombres + ' ' + usuario.apellidos);
                        sheet.cell('H10').value(usuario.n_doc);
                        sheet.cell('H11').value(createInformeDto.dependencia);

                        let filas = [];
                        sanciones.forEach((sancion, index) => {                                                    
                            sheet.cell('A' + (16 + index)).value(index + 1);
                            sheet.cell('B' + (16 + index)).value(sancion.usuario.nombres + ' ' + sancion.usuario.apellidos);                      
                            sheet.cell('E' + (16 + index)).value(sancion.usuario.n_doc);
                            sheet.cell('G' + (16 + index)).value(sancion.usuario.correo_inst);
                            sheet.cell('I' + (16 + index)).value(sancion.duracion);
                            let stateSanc = '';
                            if(sancion.estado){
                                sheet.cell('J' + (16 + index)).value('Activo');
                                stateSanc = 'Activo';
                            }else{
                                sheet.cell('J' + (16 + index)).value('Inactivo');
                                stateSanc = 'Inactivo';
                            }                            
                            sheet.cell('K' + (16 + index)).value(sancion.description);
                            filas.push([(index + 1), sancion.usuario.nombres + ' ' + sancion.usuario.apellidos, sancion.usuario.n_doc, 
                                sancion.usuario.correo_inst, sancion.duracion, stateSanc, sancion.description]);
                        });

                        await workbook.toFileAsync(informePath);
                        
                        
                        const columnas = ['N.', 'NOMBRES', 'DOCUMENTO', 'CORREO', 'DURACION', 'ESTADO', 'TIPO DE SANCION'];
                        const tamanoColumna = [30, 130, 80, 150, 80, 80, 170]; // 
                        this.createPDF(nombreInforme, tipo_informe.nombre.toUpperCase(),{
                            numero: (tipo_informe.numero + 1),
                            fecha: fecha,
                            nombre: usuario.nombres + ' ' + usuario.apellidos,
                            documento: usuario.n_doc,
                            dependencia: createInformeDto.dependencia,
                            observaciones: createInformeDto.observaciones
                          }, columnas, tamanoColumna, filas, 'H');


                        this.updateNumInforme(createInformeDto.tipo_informe, tipo_informe.nombre, tipo_informe.numero + 1);

                        await new this.informeModel({
                            nombre: nombreInforme.replaceAll('.xlsx', ''),
                            fecha: fecha,
                            numero: (tipo_informe.numero + 1),
                            pathPdf: informePdfPath,
                            pathXlsx: informePath
                        }).save();


                        return {
                            path: informePdfPath,
                            nombre: nombreInforme.replaceAll('.xlsx', '')
                        };


                        return { message: 'Archivo XLSX actualizado correctamente' };
                    } catch (error) {
                        console.log(error);
                        return { error: 'Error al actualizar el archivo XLSX', details: error };
                    }        
                } catch (error) {
                    return 'Error al copiar el archivo: ' + error;
                }

            }
        } catch (error) {

        }
        
    }

    async updateNumInforme(id: string, nombre: string, num: number){
        this.tipoInformeService.update(id, {nombre: nombre, numero: num});
    }

    async createPDF(nombreArchivo: string, titulo: string, head:{}, columnas: string[], tamanoColumna: number[], filas: string[][], orientacion: string){
        try {
            const informesFolder = PATH_ABSOLUTA_INFORME + 'informes/';
            const pdfFolder = informesFolder + 'pdf/';
            const imgInformesFolder = informesFolder + 'img/';

            const PDFDocument = require("pdfkit-table");
            let doc;
            if(orientacion === 'H'){
                doc = new PDFDocument({ margin: 30, size: 'letter', layout: 'landscape'});
            }else{
                doc = new PDFDocument({ margin: 30, size: 'letter'});
            }

            doc.image(imgInformesFolder + 'logoBienestar.png', 27, 15, {width: 200});
            doc.moveDown(4);
            
            doc.font('Helvetica-Bold');
            doc.fontSize(11);
            doc.fillColor('black');
            doc.text(titulo, { align: 'center' });
            doc.moveDown(0.5);

            doc.text('INFORME N°: ' + head['numero'], { align: 'right' });
            doc.moveDown(0.1);
            doc.text('FECHA: ' + head['fecha'], { align: 'right' });
            doc.moveDown(0.1);
            doc.text('NOMBRE DEL FUNCIONARIO:        ' + head['nombre'], { align: 'left' });
            doc.moveDown(0.1);
            doc.text('NUMERO DE DOCUMENTO:            ' + head['documento'], { align: 'left' });
            doc.moveDown(0.1);
            doc.text('DEPENDENCIA:                                ' + head['dependencia'], { align: 'left' });
            doc.moveDown(2.0);

            doc.text('DETALLES', { align: 'center' });
            doc.moveDown(0.1);

            doc.font('Helvetica-Bold'); 
            doc.fontSize(11); 
            doc.fillColor('black'); 

            const table2 = {
            headers: columnas.map((col, index) => {
                return{label: col, property: col, width: tamanoColumna[index], align: 'center'}
            }), 
            datas: filas.map((fil) => {
                let filaValue = {};
                for(let i=0; i<columnas.length; i++){
                filaValue[columnas[i]] = fil[i];
                }
                return filaValue
            })
            };
            await doc.table(table2, {});

            doc.moveDown(2.0);
            doc.font('Helvetica-Bold'); 
            doc.fontSize(11); 
            doc.fillColor('black'); 
            doc.text('OBSERVACIONES', { align: 'center' });
            doc.moveDown(0.1);
            doc.font('Helvetica'); 
            doc.fontSize(11); 
            doc.fillColor('black'); 
            doc.text(head['observaciones'], { align: 'left' });
            
            //doc.pipe(fs.createWriteStream('./src/informe/informes/pdf/' + nombreArchivo.replaceAll('.xlsx', '') + '.pdf'));
            doc.pipe(fs.createWriteStream(pdfFolder + nombreArchivo.replaceAll('.xlsx', '') + '.pdf'));
            doc.end();
        } catch (error) {
            console.log("ERROR: ", error);
        }
    }

    getDate(){
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = String(currentDate.getFullYear());
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    async createFolder(){
        const fs = require('fs');
        const plantillasFolder = PATH_ABSOLUTA_INFORME + 'plantillas/';
        const informesFolder = PATH_ABSOLUTA_INFORME + 'informes/';
        const pdfFolder = informesFolder + 'pdf/';
        const imgInformesFolder = informesFolder + 'img/';

        if(!fs.existsSync(plantillasFolder)){
            try {
                fs.mkdirSync(plantillasFolder, { recursive: true });
                console.log('Directorio creado con éxito:', plantillasFolder);
            } catch (err) {
                console.error('Error al crear el directorio:', err);
            }
        }else {
            console.log('El directorio ya existe:', plantillasFolder);
        }
        await fs.copyFileSync('./src/informe/plantillas/nuevos_implementos.xlsx', plantillasFolder + 'nuevos_implementos.xlsx');
        await fs.copyFileSync('./src/informe/plantillas/inventario.xlsx', plantillasFolder + 'inventario.xlsx');
        await fs.copyFileSync('./src/informe/plantillas/usuarios.xlsx', plantillasFolder + 'usuarios.xlsx');
        await fs.copyFileSync('./src/informe/plantillas/sanciones.xlsx', plantillasFolder + 'sanciones.xlsx');

        if(!fs.existsSync(informesFolder)){
            try {
                fs.mkdirSync(informesFolder, { recursive: true });
                console.log('Directorio creado con éxito:', informesFolder);
            } catch (err) {
                console.error('Error al crear el directorio:', err);
            }
        }else {
            console.log('El directorio ya existe:', informesFolder);
        }

        if(!fs.existsSync(pdfFolder)){
            try {
                fs.mkdirSync(pdfFolder, { recursive: true });
                console.log('Directorio creado con éxito:', pdfFolder);
            } catch (err) {
                console.error('Error al crear el directorio:', err);
            }
        }else {
            console.log('El directorio ya existe:', pdfFolder);
        }

        if(!fs.existsSync(imgInformesFolder)){
            try {
                fs.mkdirSync(imgInformesFolder, { recursive: true });
                console.log('Directorio creado con éxito:', imgInformesFolder);
            } catch (err) {
                console.error('Error al crear el directorio:', err);
            }
        }else {
            console.log('El directorio ya existe:', imgInformesFolder);
        }
        await fs.copyFileSync('./src/informe/informes/img/logoBienestar.png', imgInformesFolder + 'logoBienestar.png');
    }


    async findAll(){        
        return this.informeModel.find();
    }

    async findOneById(id: string) {
        try {
          const objId = new Types.ObjectId(id);
          const found = (await this.informeModel.findOne({ _id: objId }));
          if (!found) {
            throw new HttpException('Informe NO existe', HttpStatus.NOT_FOUND);
          }
          return found;
        } catch (error) {
          throw new HttpException('ID informe Invalido', HttpStatus.NOT_ACCEPTABLE);
        }
    }

    
    


    
    

}
