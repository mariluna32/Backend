import { Controller, Get, Param } from '@nestjs/common';

@Controller('')
export class AppController {

    @Get('date')
    getDate(){
        const moment = require('moment');
        return {
            day: moment().date(),
            month: moment().month() + 1,
            year: moment().year(),
            weekDay: ()=>{
                switch (moment().isoWeekday()){
                    case 1: return "Lunes";
                    case 2: return "Martes";
                    case 3: return "Miercoles";
                    case 4: return "Jueves";
                    case 5: return "Viernes";
                    case 6: return "Sabado";
                    case 7: return "Domingo";
                }
            } 
        };
    }

    @Get('numero-informe/:id')
    getNumeroInforme(@Param('id') id: string){

    }
}
