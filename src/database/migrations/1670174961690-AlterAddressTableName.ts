import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterAddressTableName1670174961690 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('address', 'addresses');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable('addresses', 'address');
    }

}
