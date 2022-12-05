import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { ViaCepResponse } from './dto/via-cep.dto';
import { Addresses } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(private readonly httpService: HttpService) {}

  create(createAddressDto: ViaCepResponse): Addresses {
    const newAddress = new Addresses({
      street: createAddressDto.logradouro,
      number: 0,
      complement: createAddressDto.complemento,
      neighborhood: createAddressDto.bairro,
      city: createAddressDto.localidade,
      state: createAddressDto.uf,
      zipCode: +createAddressDto.cep.replace('-', ''),
    });

    return newAddress;
  }

  async findByCep(cep: number): Promise<ViaCepResponse> {
    const response = (
      await this.httpService
        .get(`https://viacep.com.br/ws/${cep}/json/`)
        .toPromise()
    ).data;

    if (response.erro)
      throw new HttpException('CEP não encontrado', HttpStatus.NOT_FOUND);

    return response;
  }
}
