export interface ResultadoToken {
    id:          string;
    nombre:      string;
    apellidos:   string;
    correo_inst: string;
    rol:         string;
    iat:         number;
    exp:         number;
}


export interface IsUseToken {
    id:          string;
    nombre:      string;
    apellidos:   string;
    correo_inst: string;
    rol:         string;
    isExpired: boolean;
}
