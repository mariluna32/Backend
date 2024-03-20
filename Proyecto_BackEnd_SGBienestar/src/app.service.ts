import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    private serverAddress: { address: string, family: string, port: number };
    private serverLinkAddress = '';

    setServerAddress(address: { address: string, family: string, port: number }) {
        this.serverAddress = address;
    }

    setServerLinkAddress(link: string){
        this.serverLinkAddress = link;
    }

    getServerAddress() {
        return this.serverAddress;
    }

    getServerLinkAddress(){
        return this.serverLinkAddress;
    }
}
