import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterCrmUniqueConstraintToPartialUnique1670346973541 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        if (await queryRunner.hasColumn('doctors', 'crm')) {
            await queryRunner.dropColumn('doctors', 'crm');
        }

        await queryRunner.addColumn('doctors',
            new TableColumn({
            name: 'crm',
            type: 'varchar',
            isNullable: false
            }))
        
        await queryRunner.query(
            `ALTER TABLE doctors
            ADD CONSTRAINT doctors_crm_unique UNIQUE (crm, deletedAt);`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE doctors
            DROP CONSTRAINT doctors_crm_unique;`
        )
    }

}
