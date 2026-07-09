import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller()
export class LessonsController {
  constructor(private readonly lessons: LessonsService) {}

  @Get('parcours/:subjectId')
  parcours(@CurrentUser() user: AuthUser, @Param('subjectId') subjectId: string) {
    return this.lessons.getParcours(user.id, subjectId);
  }

  @Get('lessons/:subjectId/:nodeIndex')
  lesson(
    @Param('subjectId') subjectId: string,
    @Param('nodeIndex', ParseIntPipe) nodeIndex: number,
  ) {
    return this.lessons.getLesson(subjectId, nodeIndex);
  }
}
