import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private readonly httpService: HttpService) {}

  async findByCep(cep: number): Promise<ViaCepResponse> {
    const response = (await this.httpService
      .get(`https://viacep.com.br/ws/${cep}/json/`)
      .toPromise()).data;

    if (response.erro)
      throw new HttpException('CEP não encontrado', HttpStatus.NOT_FOUND);

    return response;
  }
}
