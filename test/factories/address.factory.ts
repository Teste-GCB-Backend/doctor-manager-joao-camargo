import { Addresses } from "../../src/addresses/entities/address.entity";

const newAddressEntity = () => {
    return new Addresses({
      street: newAddressResponseViaCep().logradouro,
      number: 0,
      complement: newAddressResponseViaCep().complemento,
      neighborhood: newAddressResponseViaCep().bairro,
      city: newAddressResponseViaCep().localidade,
      state: newAddressResponseViaCep().uf,
      zipCode: +newAddressResponseViaCep().cep.replace('-', ''),
    });
  };
  
  const newAddressResponseViaCep = () => {
    return {
      cep: '01001000',
      logradouro: 'Praça da Sé',
      complemento: 'lado ímpar',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
      unidade: '',
      ibge: '3550308',
      gia: '1004',
    };
  };
  
  
  export default {
    newAddressEntity,
    newAddressResponseViaCep,
  };