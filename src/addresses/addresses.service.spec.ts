import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';

import { serviceProvider } from '../utils/providers';
import { AddressesService } from './addresses.service';

describe('AddressesService', () => {
  let service: AddressesService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressesService,
      serviceProvider(HttpService)],
    }).compile();

    service = module.get<AddressesService>(AddressesService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
