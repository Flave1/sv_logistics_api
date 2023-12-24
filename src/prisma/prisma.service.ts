import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const databaseUrl = 'sqlserver://SQL8006.site4now.net:1433;database=db_a86846_foodie;user=db_a86846_foodie_admin;password=85236580@Fo;encrypt=true'//config.get('DATABASE_URL');
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.user.deleteMany(),
      this.restaurant.deleteMany(),
    ]);
  }
}