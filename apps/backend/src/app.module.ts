import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { ProgressModule } from './modules/progress/progress.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { SocraticModule } from './modules/socratic/socratic.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SubjectsModule,
    ProgressModule,
    LessonsModule,
    QuizModule,
    ActivitiesModule,
    SocraticModule,
    // Modules à venir : badges/status.
  ],
  controllers: [HealthController],
})
export class AppModule {}
