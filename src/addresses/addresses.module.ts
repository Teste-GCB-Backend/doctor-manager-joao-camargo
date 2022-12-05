import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { AddressesService } from './addresses.service';
import { Addresses } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Addresses]), HttpModule],
  providers: [AddressesService],
  exports: [AddressesService]
})
export class AddressesModule {}
