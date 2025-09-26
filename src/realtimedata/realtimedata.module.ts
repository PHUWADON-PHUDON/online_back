import { Module } from '@nestjs/common';
import { RealtimedataService } from './realtimedata.service';
import { RealtimedataGateway } from './realtimedata.gateway';

@Module({
  providers: [RealtimedataGateway, RealtimedataService],
})
export class RealtimedataModule {}
