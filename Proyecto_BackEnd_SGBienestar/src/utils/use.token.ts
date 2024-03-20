
import { IsUseToken, ResultadoToken } from "../interfaces/registro.interfaces";
import * as jwt from "jsonwebtoken"

export const useToken = (token: string): IsUseToken | string => {
    try {
        const decode = jwt.decode(token) as ResultadoToken | null
        if (!decode) {
            return  'Token inválido';
        }
        const fechaActual = new Date()
        const fechaExpiracion = new Date(decode.exp)
        console.log(decode)

        return {
            id: decode.id,
            nombre: decode.nombre,
            apellidos: decode.apellidos,
            correo_inst: decode.correo_inst,
            rol: decode.rol,
            isExpired: +fechaExpiracion <= +fechaActual / 1000 
        }
        
    } catch (error) {
        
        return 'Token invalido'
    }
}