import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // Les modules métier (auth, users, subjects, lessons, quiz, socratic,
    // progression, badges) seront ajoutés au fil des étapes suivantes.
  ],
  controllers: [HealthController],
})
export class AppModule {}
