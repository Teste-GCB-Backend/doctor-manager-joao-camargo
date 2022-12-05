import {MigrationInterface, QueryRunner} from "typeorm";

export class FixSpecialtyColumnNameOnDoctorTablr1670255744415 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (await queryRunner.hasColumn('doctors', 'specialityId')) {
            await queryRunner.renameColumn('doctors', 'specialityId', 'specialtyId');
        }
        
        await queryRunner.query(`ALTER TABLE doctors_specialties
        ADD CONSTRAINT fk_doctors_id_doctors_specialties
        FOREIGN KEY doctorId(doctorId)
        REFERENCES doctors(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`);

        await queryRunner.query(`ALTER TABLE doctors_specialties
        ADD CONSTRAINT fk_specialties_id_doctors_specialties
        FOREIGN KEY specialtyId(specialtyId)
        REFERENCES specialty(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('doctors', 'specialtyId', 'specialityId');

        await queryRunner.query(`ALTER TABLE doctors_specialties
        DROP CONSTRAINT fk_doctor_id_doctors_specialties;`);

        await queryRunner.query(`ALTER TABLE doctors_specialties
        DROP CONSTRAINT fk_specialty_id_doctors_specialties;`);

    }

}
