import { HttpException, HttpStatus, Inject, Injectable, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateInformeDTO } from './dto/informe.dto';

import * as fs from 'fs';
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
               @Inject(TipoInformeService)readonly tipoInformeService: TipoInformeService) {this.createFolder();}


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
                    const nombreInforme = tipo_informe.nombre + ' ' + fecha.replaceAll('/', '_').replaceAll(':', '_').replaceAll('.', '_') + '.xlsx';
                    const informePath = informesFolder + nombreInforme;    
                    const informePdfPath = informesFolder + 'pdf/' + nombreInforme.replaceAll('.xlsx', '.pdf');
                    try {
                        let filas = [];
                        createInformeDto.implemento.forEach((implemento, index) => {
                            filas.push([(index + 1), implemento.nombre, implemento.cantidad, implemento.caracteristicas]);
                        });

                        const columnasXlsx = ['N.', 'NOMBRE DEL IMPLEMENTO', '', '', '', 'CANTIDAD', 'CARACTERISTICAS', '', ''];
                        const columnas = ['N.', 'NOMBRE DEL IMPLEMENTO', 'CANTIDAD', 'CARACTERISTICAS'];
                        const head = {
                            numero: (tipo_informe.numero + 1),
                            fecha: fecha,
                            nombre: usuario.nombres + ' ' + usuario.apellidos,
                            documento: usuario.n_doc,
                            dependencia: createInformeDto.dependencia,
                            observaciones: createInformeDto.observaciones
                          };

                        this.createXlsx(nombreInforme, tipo_informe.nombre.toUpperCase(), head, columnasXlsx, [4.33, 10, 10, 9, 2.83, 9.5, 10, 14.67, 10], ['center', 'right', '', '', '', 'center', 'left', '', ''], filas, 'V');
                        this.createPDF(nombreInforme, tipo_informe.nombre.toUpperCase(), head, columnas, [30, 270, 50, 200], filas, 'V');

                        this.updateNumInforme(createInformeDto.tipo_informe, tipo_informe.nombre, tipo_informe.numero + 1);

                        const save = await new this.informeModel({
                            nombre: nombreInforme.replaceAll('.xlsx', ''),
                            fecha: fecha,
                            numero: (tipo_informe.numero + 1),
                            pathPdf: informePdfPath,
                            pathXlsx: informePath
                        }).save();

                        return {
                            _id: save._id,
                            pathPDF: informePdfPath,
                            pathXLSX: informePath,
                            nombre: nombreInforme.replaceAll('.xlsx', '')
                        };

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
                        const arrayDeIds = [];
                        createInformeDto.estado_implemento.forEach((estado) => {
                            try {
                                arrayDeIds.push(new Types.ObjectId(estado));
                            } catch (error) {}                            
                        });

                        implementos = await this.implementoModel.find({'estado.estado': {$in: createInformeDto.estado_implemento}}).sort({nombre: 1})
                        .populate('marca')
                        .populate('categoria')
                        .populate('estado.estado');
                    }else{
                        implementos = await this.implementoModel.find().sort({nombre: 1})
                        .populate('marca')
                        .populate('categoria')
                        .populate('estado.estado');
                    }                    
                         
                    if (!implementos) {
                        return null
                    }

                    const informesFolder = PATH_ABSOLUTA_INFORME + 'informes/';
                    const nombreInforme = tipo_informe.nombre + ' ' + fecha.replaceAll('/', '_').replaceAll(':', '_').replaceAll('.', '_') + '.xlsx';
                    const informePath = informesFolder + nombreInforme;       
                    const informePdfPath = informesFolder + 'pdf/' + nombreInforme.replaceAll('.xlsx', '.pdf');
                    try {
                        let filas = [];
                        implementos.forEach((implemento, index) => {
                            let categorias = '';
                            implemento.categoria.forEach((cat) =>{
                                categorias += cat.nombre + ', ';
                            });                            

                            let caracteristicas = '';
                            for (var clave in implemento.descripcion) {
                                if (implemento.descripcion.hasOwnProperty(clave)) {
                                    var valor = implemento.descripcion[clave];
                                    caracteristicas += clave + ': ' + valor + ', '
                                }
                            }

                            let estados = '';
                            implemento.estado.forEach((est) => {
                                estados += est.estado[0].estado + ': ' + est.cantidad + ', ';
                            });
                            filas.push([(index + 1), implemento.nombre, implemento.cantidad, caracteristicas.substring(0, (caracteristicas.length-2)), estados.substring(0, (estados.length-2))]);
                        });

                        const columnasXlsx = ['N.', 'IMPLEMENTOS', '', '', 'CANTIDAD', 'CARACTERISTICAS', '', 'ESTADO', ''];
                        const columnas = ['N.', 'IMPLEMENTOS', 'CANTIDAD', 'CARACTERISTICAS', 'ESTADO'];
                        const head = {
                            numero: (tipo_informe.numero + 1),
                            fecha: fecha,
                            nombre: usuario.nombres + ' ' + usuario.apellidos,
                            documento: usuario.n_doc,
                            dependencia: createInformeDto.dependencia,
                            observaciones: createInformeDto.observaciones
                          };

                        this.createXlsx(nombreInforme, tipo_informe.nombre.toUpperCase(), head, columnasXlsx, [4.5, 10, 10, 10, 8, 10, 11.5, 6.5, 15.33], ['center', 'right', '', '', 'center', 'right', '', 'right', ''], filas, 'V');
                        this.createPDF(nombreInforme, tipo_informe.nombre.toUpperCase(), head, columnas, [30, 240, 50, 150, 80], filas, 'V');

                        this.updateNumInforme(createInformeDto.tipo_informe, tipo_informe.nombre, tipo_informe.numero + 1);

                        const save = await new this.informeModel({
                            nombre: nombreInforme.replaceAll('.xlsx', ''),
                            fecha: fecha,
                            numero: (tipo_informe.numero + 1),
                            pathPdf: informePdfPath,
                            pathXlsx: informePath
                        }).save();

                        return {
                            _id: save._id,
                            path: informePdfPath,
                            pathXLSX: informePath,
                            nombre: nombreInforme.replaceAll('.xlsx', '')
                        };

                    } catch (error) {
                        console.log(error);
                        return { error: 'Error al actualizar el archivo XLSX', details: error };
                    }        
                } catch (error) {
                    return 'Error al copiar el archivo: ' + error;
                }
            }else if(tipo_informe.nombre === 'Informe de Usuario'){
                const usuarios = await this.usuarioModel.find().sort({n_doc: 1}).populate('ficha');
                if (!usuarios) {
                    return null
                }
                
                try {
                    const informesFolder = PATH_ABSOLUTA_INFORME + 'informes/';
                    const nombreInforme = tipo_informe.nombre + ' ' + fecha.replaceAll('/', '_').replaceAll(':', '_').replaceAll('.', '_') + '.xlsx';
                    const informePath = informesFolder + nombreInforme;      
                    const informePdfPath = informesFolder + 'pdf/' + nombreInforme.replaceAll('.xlsx', '.pdf');        
                    try {
                        let filas = [];
                        usuarios.forEach((usr, index) => {
                            const ficha = usr.ficha;                         
                            if(ficha){
                                filas.push([(index + 1), ficha['codigo'], usr.nombres + ' ' + usr.apellidos, usr.n_doc, usr.correo_inst, usr.telefono]);
                            }else{
                                filas.push([(index + 1), '', usr.nombres + ' ' + usr.apellidos, usr.n_doc, usr.correo_inst, usr.telefono]);
                            }                          
                        });                        
                        
                        const columnasXlsx = ['N.', 'N. FICHA', 'NOMBRES', '', 'N. DOCUMENTO', '', 'CORREO', '', 'TELEFONO'];
                        const columnas = ['N.', 'N. FICHA', 'NOMBRES', 'N. DOCUMENTO', 'CORREO', 'TELEFONO'];
                        const head = {
                            numero: (tipo_informe.numero + 1),
                            fecha: fecha,
                            nombre: usuario.nombres + ' ' + usuario.apellidos,
                            documento: usuario.n_doc,
                            dependencia: createInformeDto.dependencia,
                            observaciones: createInformeDto.observaciones
                        };

                        this.createXlsx(nombreInforme, tipo_informe.nombre.toUpperCase(), head, columnasXlsx, [4.33, 10, 10, 13.17, 8.5, 3, 10, 11.33, 12.33], ['center', 'right', 'right', '', 'right', '', 'right', '', 'center'], filas, 'V');
                        this.createPDF(nombreInforme, tipo_informe.nombre.toUpperCase(), head, columnas, [30, 70, 120, 80, 150, 100], filas, 'V');

                        this.updateNumInforme(createInformeDto.tipo_informe, tipo_informe.nombre, tipo_informe.numero + 1);

                        const save = await new this.informeModel({
                            nombre: nombreInforme.replaceAll('.xlsx', ''),
                            fecha: fecha,
                            numero: (tipo_informe.numero + 1),
                            pathPdf: informePdfPath,
                            pathXlsx: informePath
                        }).save();

                        return {
                            _id: save._id,
                            path: informePdfPath,
                            pathXLSX: informePath,
                            nombre: nombreInforme.replaceAll('.xlsx', '')
                        };

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
                const usuariosId = createInformeDto.usuarios.map((usuario) => {
                    try {
                        return new Types.ObjectId(usuario);
                    } catch (error) {
                        
                    }
                });
                const filtro = {};
                if(!usuariosId.includes(undefined)){
                    filtro['usuario'] = {$in: usuariosId};
                }
                if(estado === 'Activo'){
                    filtro['estado'] = true;
                }else if(estado === 'Inactivo'){
                    filtro['estado'] = false;
                }
                sanciones = await this.sancionModel.find(filtro).sort({createdAt: -1}).populate('usuario');
                try {
                    const informesFolder = PATH_ABSOLUTA_INFORME + 'informes/';
                    const nombreInforme = tipo_informe.nombre + ' ' + fecha.replaceAll('/', '_').replaceAll(':', '_').replaceAll('.', '_') + '.xlsx';
                    const informePath = informesFolder + nombreInforme;    
                    const informePdfPath = informesFolder + 'pdf/' + nombreInforme.replaceAll('.xlsx', '.pdf');        
                    try {
                        let filas = [];
                        sanciones.forEach((sancion, index) => {
                            let stateSanc = '';
                            if(sancion.estado){
                                stateSanc = 'Activo';
                            }else{
                                stateSanc = 'Inactivo';
                            }
                            filas.push([(index + 1), sancion.usuario.nombres + ' ' + sancion.usuario.apellidos, sancion.usuario.n_doc, 
                                sancion.usuario.correo_inst, sancion.duracion, stateSanc, sancion.description]);
                        });                     
                        
                        const columnasXlsx = ['N.', 'NOMBRES', '', '', 'DOCUMENTO', '', 'CORREO', '', 'DURACION', 'ESTADO', 'TIPO DE SANCION'];
                        const columnas = ['N.', 'NOMBRES', 'DOCUMENTO', 'CORREO', 'DURACION', 'ESTADO', 'TIPO DE SANCION'];
                        const head = {
                            numero: (tipo_informe.numero + 1),
                            fecha: fecha,
                            nombre: usuario.nombres + ' ' + usuario.apellidos,
                            documento: usuario.n_doc,
                            dependencia: createInformeDto.dependencia,
                            observaciones: createInformeDto.observaciones
                        };

                        this.createXlsx(nombreInforme, tipo_informe.nombre.toUpperCase(), head, columnasXlsx, [4.67, 10, 10, 5.5, 8, 3, 10, 15.67, 10, 15.83, 23.33], ['center', 'right', '', '', 'right', '', 'right', '', 'center', 'center', 'left'], filas, 'H');
                        this.createPDF(nombreInforme, tipo_informe.nombre.toUpperCase(), head, columnas, [30, 130, 80, 150, 80, 80, 170], filas, 'H');

                        this.updateNumInforme(createInformeDto.tipo_informe, tipo_informe.nombre, tipo_informe.numero + 1);

                        const save = await new this.informeModel({
                            nombre: nombreInforme.replaceAll('.xlsx', ''),
                            fecha: fecha,
                            numero: (tipo_informe.numero + 1),
                            pathPdf: informePdfPath,
                            pathXlsx: informePath
                        }).save();

                        return {
                            _id: save._id,
                            path: informePdfPath,
                            pathXLSX: informePath,
                            nombre: nombreInforme.replaceAll('.xlsx', '')
                        };
                        
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

    async createXlsx(nombreArchivo: string, titulo: string, head:{}, columnas: string[], tamanoColumna: number[], alineacion: string[], filas: string[][], orientacion: string){
        const ExcelJS = require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Hoja1');  
        
        if(orientacion == 'H'){
            worksheet.pageSetup.orientation = 'landscape';
        }
        
        worksheet.pageSetup.margins = {
          left: 0.5,
          right: 0.1,
          top: 0.1,
          bottom: 0.1,
          header: 0.1,
          footer: 0.1,
        };
        
        const image = workbook.addImage({
          filename: PATH_ABSOLUTA_INFORME + 'informes/img/logoBienestar.png',
          extension: 'png',
        });
        worksheet.addImage(image, {
          tl: { col: 0, row: 0 },
          br: { col: 4, row: 4 },
        });
    
        worksheet.mergeCells(5, 1, 5, columnas.length);
        let celda = worksheet.getCell('A5');
        celda.value = titulo;
        celda.font = { bold: true };
        celda.alignment = { vertical: 'middle', horizontal: 'center' };
    
        worksheet.mergeCells('G6:H6');
        celda = worksheet.getCell('G6');
        celda.value = 'INFORME N°.';
        celda.font = { bold: true };
        celda.alignment = { vertical: 'middle', horizontal: 'center' };
        celda = worksheet.getCell('I6');
        celda.value = head['numero'];
        celda.alignment = { vertical: 'middle', horizontal: 'center' };
    
        worksheet.mergeCells('H7:I7');
        celda = worksheet.getCell('G7');
        celda.value = 'FECHA:';
        celda.font = { bold: true };
        celda.alignment = { vertical: 'middle', horizontal: 'right' };
        celda = worksheet.getCell('H7');
        celda.value = head['fecha'];
        celda.alignment = { vertical: 'middle', horizontal: 'center' };
    
        worksheet.mergeCells('A9:C9');
        worksheet.mergeCells('F9:I9');
        celda = worksheet.getCell('A9');
        celda.value = 'NOMBRE DEL FUNCIONARIO:';
        celda.font = { bold: true };
        celda.alignment = { vertical: 'middle', horizontal: 'left' };
        celda = worksheet.getCell('F9');
        celda.value = head['nombre'];
        celda.alignment = { vertical: 'middle', horizontal: 'center' };
    
        worksheet.mergeCells('A10:C10');
        worksheet.mergeCells('F10:I10');
        celda = worksheet.getCell('A10');
        celda.value = 'NUMERO DE DOCUMENTO:';
        celda.font = { bold: true };
        celda.alignment = { vertical: 'middle', horizontal: 'left' };
        celda = worksheet.getCell('F10');
        celda.value = head['documento'];
        celda.alignment = { vertical: 'middle', horizontal: 'center' };
    
        worksheet.mergeCells('A11:C11');
        worksheet.mergeCells('F11:I11');
        celda = worksheet.getCell('A11');
        celda.value = 'DEPENDENCIA:';
        celda.font = { bold: true };
        celda.alignment = { vertical: 'middle', horizontal: 'left' };
        celda = worksheet.getCell('F11');
        celda.value = head['dependencia'];
        celda.alignment = { vertical: 'middle', horizontal: 'center' };
    
        worksheet.mergeCells(14, 1, 14, columnas.length);
        celda = worksheet.getCell('A14');
        celda.value = 'DETALLES';
        celda.font = { bold: true };
        celda.alignment = { vertical: 'middle', horizontal: 'center' };
    
        columnas.forEach((col, index) => {
          worksheet.getColumn(index+1).width = tamanoColumna[index];     
          if(columnas[index] != ''){
            let lastCellMerge = 0;
            for(let i=(index+1); i<columnas.length; i++){
              if(columnas[i] != ''){          
                break;
              }else{
                lastCellMerge = i+1;
              }
            }
            if(lastCellMerge != 0){
              worksheet.mergeCells(15, (index+1), 15, lastCellMerge); 
              for(let j=0; j<filas.length; j++){
                worksheet.mergeCells((16+j), (index+1), (16+j), lastCellMerge); 
              }
            }
            celda = worksheet.getCell(15, (index+1));
            celda.value = col;
            celda.font = { bold: true };
            celda.alignment = { vertical: 'middle', horizontal: 'center' };
          }
        });
    
        filas.forEach((fila, indexF) => {
          let cont = 0;
          columnas.forEach((col, indexC) => {
            if(col != ''){
              celda = worksheet.getCell((16 + indexF), (indexC+1));
              celda.value = fila[cont];
              celda.alignment = { wrapText: true, vertical: 'middle', horizontal: alineacion[indexC] };
              cont++;
            }        
          }); 
        });
    
        const filaObs = 18 + filas.length;
        worksheet.mergeCells(filaObs, 1, filaObs, columnas.length);
        worksheet.mergeCells(filaObs+1, 1, filaObs+8, columnas.length);
        celda = worksheet.getCell(filaObs, 1);
        celda.value = 'OBSERVACIONES';
        celda.font = { bold: true };
        celda.alignment = { vertical: 'middle', horizontal: 'center' };
        celda = worksheet.getCell(filaObs+1, 1);
        celda.value = head['observaciones'];
        celda.alignment = { vertical: 'top', horizontal: 'left' };
    
        await workbook.xlsx.writeFile(PATH_ABSOLUTA_INFORME + 'informes/' + nombreArchivo);
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
        const informesFolder = PATH_ABSOLUTA_INFORME + 'informes/';
        const pdfFolder = informesFolder + 'pdf/';
        const imgInformesFolder = informesFolder + 'img/';

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
