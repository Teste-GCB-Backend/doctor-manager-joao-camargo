import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterDefaultDeletedColumn1670345500334 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE doctors
            ALTER COLUMN deletedAt SET DEFAULT NULL;`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE doctors
            ALTER COLUMN deletedAt SET DEFAULT now();`
        )
    }

}
