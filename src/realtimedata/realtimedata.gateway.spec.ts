import { Test, TestingModule } from '@nestjs/testing';
import { RealtimedataGateway } from './realtimedata.gateway';
import { RealtimedataService } from './realtimedata.service';

describe('RealtimedataGateway', () => {
  let gateway: RealtimedataGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealtimedataGateway, RealtimedataService],
    }).compile();

    gateway = module.get<RealtimedataGateway>(RealtimedataGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
