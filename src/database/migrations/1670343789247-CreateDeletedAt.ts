import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class CreateDeletedAt1670343789247 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'doctors', new TableColumn({
                name: 'deletedAt',
                type: 'timestamp',
                isNullable: true,
                default: 'now()'
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('doctors', 'deletedAt');
    }

}
