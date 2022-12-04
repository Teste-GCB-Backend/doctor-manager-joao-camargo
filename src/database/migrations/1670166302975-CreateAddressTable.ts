import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAdressTable1668378967682 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'address',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'street',
            type: 'varchar',
            length: '250',
            isNullable: false,
          },
          {
            name: 'number',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'complement',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'neighborhood',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'city',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'state',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'zipCode',
            type: 'int',
            width: 8,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('address');
  }
}
