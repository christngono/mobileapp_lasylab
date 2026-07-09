import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { ProgressModule } from '../progress/progress.module';

@Module({
  imports: [ProgressModule],
  providers: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
