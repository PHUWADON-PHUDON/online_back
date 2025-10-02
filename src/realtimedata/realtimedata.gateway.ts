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
  playqueue(@MessageBody() userid:number,@ConnectedSocket() client: Socket) {
    const player = this.realtimedataService.findmatch(userid);

    if (player) {
      if (player.player1 === userid || player.player2 === userid) {
        this.server.emit("findmatch",player);
      }
    }
  }

  handleDisconnect(client:Socket) {
    this.realtimedataService.useroffline(client.id);
    this.server.emit('useronline',{users:this.realtimedataService.useronline()});
  }
}
