import { Test, TestingModule } from '@nestjs/testing';
import { RealtimedataService } from './realtimedata.service';

describe('RealtimedataService', () => {
  let service: RealtimedataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealtimedataService],
    }).compile();

    service = module.get<RealtimedataService>(RealtimedataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
