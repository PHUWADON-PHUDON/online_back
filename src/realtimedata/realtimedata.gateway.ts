import { WebSocketGateway,SubscribeMessage,MessageBody,WebSocketServer,ConnectedSocket } from '@nestjs/websockets';
import { RealtimedataService } from './realtimedata.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors: {origin:process.env.CORS_URL,credentials: true}})
export class RealtimedataGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly realtimedataService: RealtimedataService) {}

  handleConnection(client:Socket) {}

  @SubscribeMessage("useronline")
  useronline(@MessageBody() userid:number,@ConnectedSocket() client: Socket) {
    this.realtimedataService.adduseronline(userid,client.id);
    this.server.emit('useronline',{users:this.realtimedataService.useronline()});
  }

  @SubscribeMessage("findmatch")
  playqueue(@MessageBody() userdata:{username:string,userid:number},@ConnectedSocket() client: Socket) {
    const player = this.realtimedataService.findmatch(userdata);

    if (player) {
      if (player.player1.userid === userdata.userid || player.player2.userid === userdata.userid) {
        this.server.emit("findmatch",player);
      }
    }
  }

  @SubscribeMessage("switchplayer")
  switchplayer(@MessageBody() userdata:any,@ConnectedSocket() client: Socket) {

    if (userdata.userid === userdata.player1 || userdata.userid === userdata.player2) {
       this.server.emit('switchplayer',userdata);
    }
  }

  @SubscribeMessage("outofgame")
  handleDisconnect(client:Socket) {
    this.server.emit('outofgame',this.realtimedataService.useroutofgame(client.id));

    this.realtimedataService.useroffline(client.id);
    this.server.emit('useronline',{users:this.realtimedataService.useronline()});
  }
}
