import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterPhoneColumnNameOnDoctorTable1670170539258 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('doctors', 'phone', 'landline');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('doctors', 'landline', 'phone');
    }

}
