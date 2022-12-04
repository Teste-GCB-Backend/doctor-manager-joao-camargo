import {MigrationInterface, QueryRunner} from "typeorm";

export class AddForeignKeyOnSpecialtiesDoctorTable1668381458560 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE doctors_specialties
        ADD CONSTRAINT fk_doctors_id
        FOREIGN KEY doctorId(doctorId)
        REFERENCES doctors(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`);

        await queryRunner.query(`ALTER TABLE doctors_specialties
        ADD CONSTRAINT fk_specialties_id
        FOREIGN KEY specialtyId(specialtyId)
        REFERENCES specialty(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE doctors_specialties
        DROP CONSTRAINT fk_doctor_id;`);

        await queryRunner.query(`ALTER TABLE doctors_specialties
        DROP CONSTRAINT fk_specialty_id;`);
    }

}
