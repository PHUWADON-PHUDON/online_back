import { Injectable,BadRequestException } from '@nestjs/common';

@Injectable()
export class RealtimedataService {
    private onlineuser:number[] = [];
    private onlineusermap:any = {};
    private playqueue:any = [];
    private inqueue:any = [];

    adduseronline(userid:number,clientid:string) {
        this.onlineuser.push(userid);
        this.onlineusermap[clientid] = userid;
    }

    useroutofgame(clientid:string) {
        const finduser = this.onlineusermap[clientid];

        if (finduser) {
            //clear user queue
            const finduserqueue = this.playqueue.find((e:any) => e.userid === finduser);
            if (finduserqueue) {
                const finduserqueueindex = this.inqueue.indexOf(finduserqueue);
                this.playqueue.splice(finduserqueueindex,1);
            }

            //clear user in queue
            const findout = this.inqueue.find((e:any) => e.player1 === finduser || e.player2 === finduser);
            if (findout) {
                const finduserinqueue = this.inqueue.indexOf(findout);
                this.inqueue.splice(finduserinqueue,1);
                return({player1:findout.player1,player2:findout.player2});
            }
        }
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

    findmatch(userdata:{username:string,userid:number}) {
        const findonlineuser = this.onlineuser.find(e => e === userdata.userid);

        if (findonlineuser) {
            this.playqueue.push({username:userdata.username,userid:findonlineuser});
            this.playqueue = [...new Set(this.playqueue)];

            if (this.playqueue.length >= 2) {
                const player1 = this.playqueue.shift();
                const player2 = this.playqueue.shift();

                this.inqueue.push({player1:player1.userid,player2:player2.userid});

                return({player1:player1,player2:player2});
            }
        }
    }
}
