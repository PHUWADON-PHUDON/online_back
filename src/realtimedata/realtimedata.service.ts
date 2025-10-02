import { Injectable,BadRequestException } from '@nestjs/common';
import { find } from 'rxjs';

@Injectable()
export class RealtimedataService {
    private onlineuser:number[] = [];
    private onlineusermap:any = {};
    private playqueue:number[] = [];

    adduseronline(userid:number,clientid:string) {
        this.onlineuser.push(userid);
        this.onlineusermap[clientid] = userid;
    }

    useroffline(clientid:string) {
        const finduser = this.onlineusermap[clientid];

        if (finduser) {
            const newonlineuser = this.onlineuser.filter((e:any,_:any) => e != finduser);
            this.onlineuser = [...newonlineuser];
            delete this.onlineusermap[clientid];
        }

        return([...new Set(this.onlineuser)]);
    }

    useronline() {
        return([...new Set(this.onlineuser)]);
    }

    //find match

    findmatch(userid:number) {
        const findonlineuser = this.onlineuser.find(e => e === userid);

        if (findonlineuser) {
            this.playqueue.push(findonlineuser);
            this.playqueue = [...new Set(this.playqueue)];

            if (this.playqueue.length >= 2) {
                const player1 = this.playqueue.shift();
                const player2 = this.playqueue.shift();

                return({player1:player1,player2:player2});
            }
        }
    }
}
