import { MigrationInterface, QueryRunner } from "typeorm";

export class V11758912273871 implements MigrationInterface {
    name = 'V11758912273871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap_offer" ADD "offererId" integer`);
        await queryRunner.query(`ALTER TABLE "skill_request" DROP COLUMN "title"`);
        await queryRunner.query(`CREATE TYPE "public"."skill_request_title_enum" AS ENUM('Pomoć u bašti', 'Elektronika', 'Pomoć sa računarima', 'Kuvanje', 'Čišćenje', 'Dostava', 'Pomoć pri učenju', 'Pisanje', 'Trening', 'Briga o deci', 'Briga o ljubimcima', 'Fotografija', 'Usluge lepote', 'Ostalo')`);
        await queryRunner.query(`ALTER TABLE "skill_request" ADD "title" "public"."skill_request_title_enum" NOT NULL DEFAULT 'Ostalo'`);
        await queryRunner.query(`ALTER TABLE "skill_request" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."skill_request_status_enum" AS ENUM('na čekanju', 'prihvaćeno', 'otkazano')`);
        await queryRunner.query(`ALTER TABLE "skill_request" ADD "status" "public"."skill_request_status_enum" NOT NULL DEFAULT 'na čekanju'`);
        await queryRunner.query(`ALTER TABLE "swap_offer" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."swap_offer_status_enum" AS ENUM('na čekanju', 'prihvaćeno', 'odbijeno')`);
        await queryRunner.query(`ALTER TABLE "swap_offer" ADD "status" "public"."swap_offer_status_enum" NOT NULL DEFAULT 'na čekanju'`);
        await queryRunner.query(`ALTER TABLE "skill_offer" DROP COLUMN "title"`);
        await queryRunner.query(`CREATE TYPE "public"."skill_offer_title_enum" AS ENUM('Pomoć u bašti', 'Elektronika', 'Pomoć sa računarima', 'Kuvanje', 'Čišćenje', 'Dostava', 'Pomoć pri učenju', 'Pisanje', 'Trening', 'Briga o deci', 'Briga o ljubimcima', 'Fotografija', 'Usluge lepote', 'Ostalo')`);
        await queryRunner.query(`ALTER TABLE "skill_offer" ADD "title" "public"."skill_offer_title_enum" NOT NULL DEFAULT 'Ostalo'`);
        await queryRunner.query(`ALTER TABLE "skill_offer" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."skill_offer_status_enum" AS ENUM('dostupan', 'nedostupan')`);
        await queryRunner.query(`ALTER TABLE "skill_offer" ADD "status" "public"."skill_offer_status_enum" NOT NULL DEFAULT 'dostupan'`);
        await queryRunner.query(`ALTER TABLE "swap_offer" ADD CONSTRAINT "FK_5fe58af6c3637c404b5a5c93d84" FOREIGN KEY ("offererId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "swap_offer" DROP CONSTRAINT "FK_5fe58af6c3637c404b5a5c93d84"`);
        await queryRunner.query(`ALTER TABLE "skill_offer" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."skill_offer_status_enum"`);
        await queryRunner.query(`ALTER TABLE "skill_offer" ADD "status" character varying NOT NULL DEFAULT 'available'`);
        await queryRunner.query(`ALTER TABLE "skill_offer" DROP COLUMN "title"`);
        await queryRunner.query(`DROP TYPE "public"."skill_offer_title_enum"`);
        await queryRunner.query(`ALTER TABLE "skill_offer" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "swap_offer" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."swap_offer_status_enum"`);
        await queryRunner.query(`ALTER TABLE "swap_offer" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "skill_request" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."skill_request_status_enum"`);
        await queryRunner.query(`ALTER TABLE "skill_request" ADD "status" character varying NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "skill_request" DROP COLUMN "title"`);
        await queryRunner.query(`DROP TYPE "public"."skill_request_title_enum"`);
        await queryRunner.query(`ALTER TABLE "skill_request" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "swap_offer" DROP COLUMN "offererId"`);
    }

}
