import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quiz: QuizService) {}

  @Get(':subjectId/:nodeIndex')
  get(
    @Param('subjectId') subjectId: string,
    @Param('nodeIndex', ParseIntPipe) nodeIndex: number,
  ) {
    return this.quiz.getQuiz(subjectId, nodeIndex);
  }

  @Post('submit')
  submit(@CurrentUser() user: AuthUser, @Body() dto: SubmitQuizDto) {
    return this.quiz.submit(user.id, dto.subjectId, dto.nodeIndex, dto.answers);
  }
}
