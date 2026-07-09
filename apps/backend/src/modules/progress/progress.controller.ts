import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CompleteNodeDto } from './dto/complete-node.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('progress')
export class ProgressController {
  constructor(private readonly progress: ProgressService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.progress.getForUser(user.id);
  }

  @Post('complete')
  complete(@CurrentUser() user: AuthUser, @Body() dto: CompleteNodeDto) {
    return this.progress.completeNode(user.id, dto.subjectId, dto.nodeIndex);
  }
}
