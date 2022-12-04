import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterNameCollumnInSpecialtyTable1668459913938 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('specialty', 'name', 'specialty');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('specialty', 'specialty', 'name');
    }

}
