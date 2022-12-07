import { Connection, getConnection } from 'typeorm';
import * as typeormSeed from 'typeorm-seeding';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { SpecialtyCreate } from '../src/database/seeds/specialty-seeding';
import { Doctors } from '../src/doctors/entities/doctor.entity';
import { AppModule } from '../src/app.module';
import { createFakeDoctorWithDoctorDto } from './factories/doctor.factory';
import addressFactory from './factories/address.factory';
import { Addresses } from '../src/addresses/entities/address.entity';

describe('doctors controller (e2e)', () => {
  let app: INestApplication;
  jest.setTimeout(30000);

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: process.env.TYPEORM_CONNECTION,
          host: process.env.TYPEORM_HOST,
          port: parseInt(process.env.TYPEORM_PORT),
          username: process.env.TYPEORM_USERNAME,
          password: process.env.TYPEORM_PASSWORD,
          database: `${process.env.TYPEORM_DATABASE}`,
          autoLoadEntities: true,
          synchronize: true,
          logging: true,
          entities: [__dirname + '/../src/entities/*.entity{.ts,.js}'],
        }),
      ],
    }).compile();

    app = module.createNestApplication();

    await typeormSeed.runSeeder(SpecialtyCreate);
    await app.init();
  });

  beforeEach(async () => {
    const connection: Connection = getConnection();
    await connection
      .createQueryBuilder()
      .delete()
      .from('doctors_specialties')
      .execute();
    await connection.createQueryBuilder().delete().from(Doctors).execute();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /doctors', () => {
    it('should create a new doctor', async () => {
      const doctor = await createFakeDoctorWithDoctorDto();
      const promise = await request(app.getHttpServer())
        .post('/doctors')
        .send(doctor);

      expect(promise.status).toBe(201);
      expect(promise.text).toBe('Médico cadastrado com sucesso');
    });

    it('should throw an error if the doctor has less than 2 specialties', async () => {
      const doctor = await createFakeDoctorWithDoctorDto();
      doctor.specialties = doctor.specialties.slice(0, 1);
      const promise = await request(app.getHttpServer())
        .post('/doctors')
        .send(doctor);
      expect(promise.status).toBe(400);
      expect(promise.text).toBe(
        '{"statusCode":400,"message":"Médico deve possuir ao menos duas especialidades"}',
      );
    });

    it("should throw an error if the doctor's crm is already registered", async () => {
      const doctor = await createFakeDoctorWithDoctorDto();
      const address = addressFactory.newAddressEntity();

      await getConnection()
        .getRepository(Doctors)
        .save({
          name: doctor.name,
          crm: doctor.crm,
          landline: doctor.phone,
          cellphone: doctor.cellphone,
          addressId: new Addresses(address),
        });

      const promise = await request(app.getHttpServer())
        .post('/doctors')
        .send(doctor);

      expect(promise.status).toBe(409);
      expect(promise.text).toBe(
        '{"statusCode":409,"message":"Médico já cadastrado"}',
      );
    });

    it("should throw an error if the doctor's zip code is invalid", async () => {
      const doctor = await createFakeDoctorWithDoctorDto();
      doctor.zipCode = '99999999';
      const promise = await request(app.getHttpServer())
        .post('/doctors')
        .send(doctor);

      expect(promise.status).toBe(404);
      expect(promise.text).toBe(
        '{"statusCode":404,"message":"CEP não encontrado"}',
      );
    });

    it("should throw an error if specialty doesn't exist", async () => {
      const doctor = await createFakeDoctorWithDoctorDto();
      doctor.specialties = ['teste', 'teste2'];
      const promise = await request(app.getHttpServer())
        .post('/doctors')
        .send(doctor);

      expect(promise.status).toBe(400);
      expect(promise.text).toBe(
        '{"statusCode":400,"message":"Verifique se as especialidades informadas estão corretas"}',
      );
    });
  });

  describe('GET /doctors', () => {
    it('should return a list of doctors', async () => {
      const doctor = await createFakeDoctorWithDoctorDto();
      const address = addressFactory.newAddressEntity();

      await getConnection()
        .getRepository(Doctors)
        .save({
          name: doctor.name,
          crm: doctor.crm,
          landline: doctor.phone,
          cellphone: doctor.cellphone,
          addressId: new Addresses(address),
        });

      const promise = await request(app.getHttpServer()).get('/doctors').send();

      expect(promise.status).toBe(200);
      expect(promise.body).toMatchObject([
        {
          name: doctor.name,
          crm: +doctor.crm,
          landline: `${doctor.phone}`,
          cellphone: doctor.cellphone,
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          complement: address.complement,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          specialties: [],
        },
      ]);
    });
  });

  describe('PUT /doctors/:id', () => {
    it('should update a doctor', async () => {
      const doctor = await createFakeDoctorWithDoctorDto();
      const address = addressFactory.newAddressEntity();
      const doctorCreated = await getConnection()
        .getRepository(Doctors)
        .save({
          name: doctor.name,
          crm: doctor.crm,
          landline: doctor.phone,
          cellphone: doctor.cellphone,
          addressId: new Addresses(address),
        });
      console.log(doctorCreated);
      doctor.name = 'teste';
      doctor.crm = '1234567';

      const promise = await request(app.getHttpServer())
        .put(`/doctors/${doctorCreated.id}`)
        .send(doctor);

      expect(promise.status).toBe(200);
      expect(promise.text).toBe('Médico atualizado com sucesso');
    });

    it('should update throw an error if doctor doesnt exist', async () => {
      const doctor = await createFakeDoctorWithDoctorDto();

      const promise = await request(app.getHttpServer())
        .put(`/doctors/99999999999`)
        .send(doctor);

      expect(promise.status).toBe(404);
      expect(promise.text).toBe(
        '{"statusCode":404,"message":"Médico não encontrado"}',
      );
    });
  });

  describe('DELETE /doctors/:id', () => {
    it('should delete a doctor', async () => {
      const doctor = await createFakeDoctorWithDoctorDto();
      const address = addressFactory.newAddressEntity();
      const doctorCreated = await getConnection()
        .getRepository(Doctors)
        .save({
          name: doctor.name,
          crm: doctor.crm,
          landline: doctor.phone,
          cellphone: doctor.cellphone,
          addressId: new Addresses(address),
        });

      const promise = await request(app.getHttpServer())
        .delete(`/doctors/${doctorCreated.id}`)
        .send();

      expect(promise.status).toBe(200);
      expect(promise.text).toBe('Médico deletado com sucesso.');
    });

    it('should throw an error if the doctor does not exist', async () => {
      const promise = await request(app.getHttpServer())
        .delete(`/doctors/1`)
        .send();

      expect(promise.status).toBe(404);
      expect(promise.text).toBe(
        '{"statusCode":404,"message":"Médico não encontrado."}',
      );
    });
  });
});
