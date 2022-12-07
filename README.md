# <p align = "center"> Teste Técnico Desenvolvedor Backend Jr. </p>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->



##  :clipboard: Descrição

Esta é uma API de cadastro e visualização de médicos. Com ela é possivel adicionar um médico com duas ou mais especialidades, consultar médicos cadastrados pelo Id, por um filtro qualquer (como demonstrado abaixo) ou buscando por termos em toda a tabela. Além disso, é possível editar e remover um médico. O projeto está documentado no Swagger, deployado em uma instância da AWS e configurado com CI/CD.

Estrutura do banco de dados: Para o desenvolvimento dessa API me referenciei em possíveis features futuras, visando possibilitar um menor prejuízo aos dados já salvos em caso de nova feature. Portanto, criei uma tabela de endereços, uma tabela ponte entre as especialidades, uma tabela para as especialidades (que são adicionadas por seed) e uma tabela para os médicos. 


Status de desenvolvimento: ✅ API Completa

Tempo de código (Wakatime): 16h21min

***

## :computer:	 Tecnologias e Conceitos

- Nest.js
- TypeORM
- TypeORM Seeding
- ClassValidator
- MySQL
- Swagger
- Docker
- CI/CD
- AWS

***

## :rocket: Rotas

```yml 
GET /doctors
    - Rota para listar todos os médicos
    - headers: {}
    - body: {}
```

```yml
POST /doctors
    - Rota para cadastrar um novo médico
    - headers: {}
    - body:{
        "name": string,
        "crm": string de números,
        "landline": string de números,
        "cellphone": string de números,
        "zipCode": string de números,
        "specialties": array de strings (valores possíveis: [ "Alergologia", "Angiologia", "Buco maxilo", "Cardiologia clínica", "Cardiologia infantil", "Cirurgia cabeça e pescoço", "Cirurgia cardíaca", "Cirurgia de tórax" ])
}
```
    
```yml 
GET /doctors/:id
    - Rota para listar um médico pelo id
    - headers: {}
    - body: {}
```

```yml
GET /doctors/filter?:filter
    - Rota para listar médicos que atenda determinado filtro. Possíveis filtros: name, crm, landline, cellphone, street, number, complement, neighborhood, city, state, zipCode e specialty. 
    - headers: {}
    - body: {}
``` 

```yml
GET /doctors/search/:search
    - Rota para listar médicos que contenha o parâmetro buscado, por completo ou em partes, em qualquer coluna do banco de dados.
    - headers: {}
    - body: {}
``` 

```yml
PUT /doctors/:id 
    - Rota para atualizar um médico pelo id
    - headers: {}
    - body: {
        "name": string,
        "crm": string de números,
        "landline": string de números,
        "cellphone": string de números,
        "zipCode": string de números,
        "specialties": array de strings (valores possíveis: [ "Alergologia", "Angiologia", "Buco maxilo", "Cardiologia clínica", "Cardiologia infantil", "Cirurgia cabeça e pescoço", "Cirurgia cardíaca", "Cirurgia de tórax" ])
    }
```
 
```yml
DELETE /doctors/:id
    - Rota para deletar um médico pelo id
    - headers: {}
    - body: {}
```
***

## 🏁 Rodando a aplicação

Certifique-se que voce tem a ultima versão estável do [Docker](https://www.docker.com/) rodando localmente.

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/Teste-GCB-Backend/doctor-manager-joao-camargo.git
```


O segundo passo é substituir o nome do arquivo '.env.example' para '.env'. Certifique-se de que a porta indicada no .env está disponivel.


Depois, dentro da pasta, rode o seguinte comando para iniciar o container.

```
docker-compose up
```

Acompanhe os logs do container, a aplicação deve aguardar o banco de dados estar aceitando conexão, porém pode ocorrer dela tentar conectar ao banco de dados antes dele estar pronto. Nesse caso, aperecerá um erro e em alguns segundos ela tentará se conectar novamente. Se o erro persistir, verifique qual o apontamento para o banco de dados no arquivo .env. Certifique-se de que as migrations e a seed será executada automaticamente. Caso contrário, no bash do container execute:

```
npm run typeorm:run && npm run seed:run
```

Pronto! A aplicação estará rodando na porta 3000.


## 🏁 Rodando os testes

Certifique-se que voce tem a ultima versão estável do [Docker](https://www.docker.com/) rodando localmente.

Primeiro, faça o clone desse repositório na sua maquina:

```
git clone https://github.com/Teste-GCB-Backend/doctor-manager-joao-camargo.git
```


Substitua o nome do arquivo '.env.test.example' para '.env.test' . Certifique-se de que a porta indicada no .env.test está disponivel.


Dentro da pasta, execute o código a seguir para buildar. Por motivos de conflito de versão, não utilize o script de build disponível no package.json.

```
docker-compose -f docker-compose.test.yml build
```

Depois, dentro da pasta, rode o seguinte comando para iniciar o container.

```
npm run test:docker-local
```

Acompanhe os logs do container, a aplicação deve aguardar o banco de dados estar aceitando conexão, porém pode ocorrer dela tentar conectar ao banco de dados antes dele estar pronto. Nesse caso, aperecerá um erro e em alguns segundos ela tentará se conectar novamente. Se o erro persistir, verifique qual o apontamento para o banco de dados no arquivo .env. Certifique-se de que as migrations e a seed será executada automaticamente. Caso contrário, no bash do container execute:

```
npm run typeorm:run && npm run seed:run
```

Pronto! Os testes serão executados.