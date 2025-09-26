import { WebSocketGateway,SubscribeMessage,MessageBody,WebSocketServer } from '@nestjs/websockets';
import { RealtimedataService } from './realtimedata.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({cors: {origin:process.env.CORS_URL,credentials: true}})
export class RealtimedataGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly realtimedataService: RealtimedataService) {}

  handleConnection(client:any) {
    console.log(`✅ Client connescted: ${client.id}`);

    this.realtimedataService.adduseronline();
  }

  handleDisconnect(client:any) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('useronline')
  useronline(@MessageBody() data:{userid:number}) {
    this.server.emit('useronline',{users:this.realtimedataService.useronline()});
  }
}
