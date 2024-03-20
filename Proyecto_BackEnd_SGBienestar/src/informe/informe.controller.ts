import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CreateInformeDTO } from './dto/informe.dto';
import { InformeService } from './informe.service';
import { Response } from 'express';
import * as fs from 'fs';
import { ApiTags } from '@nestjs/swagger';
import { PATH_ABSOLUTA_INFORME } from 'src/StringValues';


const ExcelJS = require('exceljs');

@ApiTags("Informes")
@Controller('informe')
export class InformeController {

constructor(private readonly informeService: InformeService) {}

  @Post()
  async create(@Body() createInformeDTO: CreateInformeDTO/*, @Res() res: Response*/) {
    //return this.informeService.create(createInformeDTO);
    const infoFile = await this.informeService.create(createInformeDTO);    
    
    /*res.header('Content-Disposition', `attachment; filename=${infoFile['nombre']}`);
    res.header('Content-Type', 'application/octet-stream');
    res.sendFile(infoFile['path']); */

    //res.sendFile(infoFile['path'], { root: '' });
    return infoFile;
    
    /*
    const pathFile = path.resolve(infoFile['path'] + ''); 
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + infoFile['nombre'],
    );
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    const fileStream = fs.createReadStream(pathFile);
    fileStream.pipe(res);*/
  }


  @Get('informes')
  async findAll(){
    return this.informeService.findAll();
  }

  @Get('informes/:id')
  async findOneById(@Param("id") id: string){
    return this.informeService.findOneById(id);
  }

  @Get('download/:tipo/:id')
  async downloadFile(@Param('id') id: string, @Param('tipo') tipo: string, @Res() res: Response){
    const file = await this.informeService.findOneById(id);
    if(tipo == 'xlsx'){
      res.header('Content-Disposition', `attachment; filename=${file.nombre}.xlsx`);
      res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.sendFile(file.pathXlsx); 
    }else if(tipo == 'pdf'){
      res.header('Content-Disposition', `attachment; filename=${file.nombre}.pdf`);
      res.header('Content-Type', 'application/pdf');
      res.sendFile(file.pathPdf); 
    }  
  }


  /*@Get('xlsxPrueba')
  async getXlsx(){

    const titulo = 'INFORME DE INVENTARIO';
    const head = {
      numero: 9999,
      fecha: '12/11/2023 11:13:00',
      nombre: 'Michel Osorio Barrera',
      documento: '1234567890',
      dependencia: 'BIENESTAR',
      observaciones: 'NO hay observaciones'
    };

    const columnas = ['N.', 'IMPLEMENTOS', '', '', 'CANTIDAD', 'CARACTERISTICAS', '', 'ESTADO', ''];
    const tamanoColumna = [4.5, 10, 10, 10, 8, 10, 11.5, 6.5, 15.33];
    const alineacion = ['center', 'right', '', '', 'center', 'right', '', 'right', ''];
    const filas = [
      [1, 'Implemento 1', 10, 'Caracteristica 1', 'Estado 1'],
      [1, 'Implemento 2', 10, 'Caracteristica 1', 'Estado 2'],
      [1, 'Implemento 3', 10, 'Caracteristica 1', 'Estado 3'],
      [1, 'Implemento 4', 10, 'Caracteristica 1', 'Estado 4'],
      [1, 'Implemento 5', 10, 'Caracteristica 1', 'Estado 5'],
      [1, 'Implemento 6', 10, 'Caracteristica 1', 'Estado 6'],
      [1, 'Implemento 7', 10, 'Caracteristica 1', 'Estado 7'],
      [1, 'Implemento 8', 10, 'Caracteristica 1', 'Estado 8'],
      [1, 'Implemento 9', 10, 'Caracteristica 1', 'Estado 9'],
      [1, 'Implemento 10', 10, 'Caracteristica 1', 'Estado 10'],
      [1, 'Implemento 11', 10, 'Caracteristica 1', 'Estado 11'],
      [1, 'Implemento 12', 10, 'Caracteristica 1', 'Estado 12'],
      [1, 'Implemento 13', 10, 'Caracteristica 1', 'Estado 13']
    ];


    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hoja1');   
    
    worksheet.pageSetup.margins = {
      left: 0.5,
      right: 0.1,
      top: 0.1,
      bottom: 0.1,
      header: 0.1,
      footer: 0.1,
    };
    
    const image = workbook.addImage({
      filename: './src/informe/informes/img/logoBienestar.png',
      extension: 'png',
    });
    worksheet.addImage(image, {
      tl: { col: 0, row: 0 },
      br: { col: 4, row: 4 },
    });

    worksheet.mergeCells('A5:I5');
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
    celda.value = head.numero;
    celda.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('H7:I7');
    celda = worksheet.getCell('G7');
    celda.value = 'FECHA:';
    celda.font = { bold: true };
    celda.alignment = { vertical: 'middle', horizontal: 'right' };
    celda = worksheet.getCell('H7');
    celda.value = head.fecha;
    celda.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A9:C9');
    worksheet.mergeCells('F9:I9');
    celda = worksheet.getCell('A9');
    celda.value = 'NOMBRE DEL FUNCIONARIO:';
    celda.font = { bold: true };
    celda.alignment = { vertical: 'middle', horizontal: 'left' };
    celda = worksheet.getCell('F9');
    celda.value = head.nombre;
    celda.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A10:C10');
    worksheet.mergeCells('F10:I10');
    celda = worksheet.getCell('A10');
    celda.value = 'NUMERO DE DOCUMENTO:';
    celda.font = { bold: true };
    celda.alignment = { vertical: 'middle', horizontal: 'left' };
    celda = worksheet.getCell('F10');
    celda.value = head.documento;
    celda.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A11:C11');
    worksheet.mergeCells('F11:I11');
    celda = worksheet.getCell('A11');
    celda.value = 'DEPENDENCIA:';
    celda.font = { bold: true };
    celda.alignment = { vertical: 'middle', horizontal: 'left' };
    celda = worksheet.getCell('F11');
    celda.value = head.dependencia;
    celda.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('A14:I14');
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
          celda.alignment = { vertical: 'middle', horizontal: alineacion[indexC] };
          cont++;
        }        
      });      
    });

    const filaObs = 18 + filas.length;
    worksheet.mergeCells(filaObs, 1, filaObs, 9);
    worksheet.mergeCells(filaObs+1, 1, filaObs+8, 9);
    celda = worksheet.getCell(filaObs, 1);
    celda.value = 'OBSERVACIONES';
    celda.font = { bold: true };
    celda.alignment = { vertical: 'middle', horizontal: 'center' };
    celda = worksheet.getCell(filaObs+1, 1);
    celda.value = head.observaciones;
    celda.alignment = { vertical: 'top', horizontal: 'left' };

    await workbook.xlsx.writeFile(PATH_ABSOLUTA_INFORME + 'informes/doc.xlsx');
  }*/


  /*@Get('pdfPrueba')
  async getPDF(@Res() res: Response){
    try {
      const columnas = ['N.', 'NOMBRE DEL IMPLEMENTO', 'CANTIDAD', 'CARACTERISTICAS'];
      const tamanoColumna = [30, 270, 50, 200]
      const filas = [
        ['1', 'BALON', '10', 'BLANCO'],
        ['2', 'BALON 2', '20', 'BLANCO 2'],
        ['3', 'BALON 3', '30', 'BLANCO 3'],
        ['4', 'BALON 4', '40', 'BLANCO 4'],
        ['5', 'BALON 5', '50', 'BLANCO 5'],
        ['6', 'BALON 6', '60', 'BLANCO 6'],
      ];
      this.createPDF('INFORME NUEVOS IMPLEMENTOS',{
        numero: 9999,
        fecha: '11/11/2023 10:50:00',
        nombre: 'MICHEL OSORIO BARRERA',
        documento: '1234567890',
        dependencia: 'BIENESTAR',
        observaciones: ''
      }, columnas, tamanoColumna, filas); 

      /*const doc = new PDFDocument({ size: 'letter' });
      doc.image('./src/informe/informes/img/logoBienestar.png', 50, 20, { width: 100 });
      doc.moveDown(1);
      
      const dataTable = {
        headers: ['Columna 1', 'Columna 2', 'Columna 3'],
        rows: [['Dato 1', 'Dato 2', 'Dato 3'], ['Dato 4', 'Dato 5', 'Dato 6']],
      };
      
      new table(doc, dataTable, {
        prepareHeader: () => doc.font('Helvetica-Bold'),
        prepareRow: (row, i) => doc.font('Helvetica').fontSize(12),
      });

      doc.pipe(fs.createWriteStream('./src/informe/informes/pdf/informe.pdf'));
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=informe.pdf');
      doc.pipe(res);
      doc.end();*
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }*/



  /*async createPDF(titulo: string, head:{}, columnas: string[], tamanoColumna: number[], filas: string[][]){
    try {
      const PDFDocument = require("pdfkit-table");
      let doc = new PDFDocument({ margin: 30, size: 'letter' });
      const table = {
        headers: columnas,
        rows: filas,
      };

      doc.image('./src/informe/informes/img/logoBienestar.png', 0, 15, {width: 200});
      doc.moveDown(3);
      
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
          //return{col1: '1', col2: {label:'BALON', align: 'right'}, col3: '10', col4: 'BLANCO'}
        })
        /*[
          {col1: '1', col2: {label:'BALON', align: 'right'}, col3: '10', col4: 'BLANCO'},
          {col1: '2', col2: {label:'BALON2', align: 'right'}, col3: '20', col4: 'BLANCO1'},
          {col1: '3', col2: {label:'BALON3', align: 'right'}, col3: '30', col4: 'BLANCO2'},
          {col1: '4', col2: {label:'BALON4', align: 'right'}, col3: '40', col4: 'BLANCO3'}
        ]*
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
      
      doc.pipe(fs.createWriteStream('./src/informe/informes/pdf/' + titulo + '.pdf'));
      doc.end();
    } catch (error) {
      console.log("ERROR: ", error);
    }
  }*/

  

  /*@Get("informe")
  async estructuraInforme() {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile('./src/informe/plantillas/inventario.xlsx');  
      let worksheet = workbook.getWorksheet('Hoja1');
      const nLastRow = 37;
      const nAddRow = 10;
      worksheet.duplicateRow(nLastRow, nAddRow, true);

      await workbook.xlsx.writeFile('./src/informe/plantillas/informe.xlsx');
      await workbook.xlsx.readFile('./src/informe/plantillas/informe.xlsx'); 
      worksheet = workbook.getWorksheet('Hoja1');
      for(let i=(nLastRow + 1); i<=(nLastRow + nAddRow); i++){
        worksheet.mergeCells(i, 2, i, 4);
        worksheet.mergeCells(i, 6, i, 7);
        worksheet.mergeCells(i, 8, i, 9);
      }
      for(let i=16; i<47; i++){
        worksheet.getCell('A'+i).value = i-15;
      }      
      await workbook.xlsx.writeFile('./src/informe/plantillas/informe.xlsx');
    } catch (error) {
      console.error('Error al abrir el archivo Excel:', error);
    }
  }
/*async removeCells() {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./src/informe/plantillas/inventario3.xlsx');

    const worksheet = workbook.getWorksheet('Hoja1');

   // Define el rango de filas que deseas eliminar, por ejemplo, desde la fila 2 hasta la fila 21
   const startRow = 25;
   const endRow = 4000;

   for (let row = startRow; row <= endRow; row++) {
     worksheet.spliceRows(row, 1);
   }

    // Guarda los cambios en el archivo
    await workbook.xlsx.writeFile('./src/informe/plantillas/tu-archivo.xlsx');
    console.log('Celdas eliminadas exitosamente.');
  } catch (error) {
    console.error('Error al abrir el archivo Excel:', error);
  }
}*/


}
