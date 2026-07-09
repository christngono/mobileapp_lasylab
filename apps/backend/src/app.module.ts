import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    // Les modules métier (auth, users, subjects, lessons, quiz, socratic,
    // progression, badges) seront ajoutés au fil des étapes suivantes.
  ],
  controllers: [HealthController],
})
export class AppModule {}
