import { Module } from '@nestjs/common';
import { SocraticService } from './socratic.service';
import { SocraticController } from './socratic.controller';
import { GroqService } from './groq.service';

@Module({
  providers: [SocraticService, GroqService],
  controllers: [SocraticController],
})
export class SocraticModule {}
