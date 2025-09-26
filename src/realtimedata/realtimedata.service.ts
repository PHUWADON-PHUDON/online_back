import { Injectable,BadRequestException } from '@nestjs/common';

@Injectable()
export class RealtimedataService {
    private onlineuser:string[] = [];

    adduseronline() {
        try{
            this.onlineuser.push("a");
        }
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }

    useronline() {
        try{
            console.log(this.onlineuser)
            return(this.onlineuser);
        }
        catch(err) {
            throw new BadRequestException(err.message);
        }
    }
}
