import {MigrationInterface, QueryRunner} from "typeorm";

export class DropSpecialtyIdColumnOnDoctorTable1670257802787 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('doctors', 'specialtyId');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE doctors
            ADD COLUMN specialtyId INT NOT NULL;`
        )
    }

}
