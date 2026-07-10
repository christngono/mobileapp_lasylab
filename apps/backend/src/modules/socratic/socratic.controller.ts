import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SocraticService } from './socratic.service';
import { AskDto } from './dto/ask.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('socratic')
export class SocraticController {
  constructor(private readonly socratic: SocraticService) {}

  @Post('ask')
  ask(@CurrentUser() user: AuthUser, @Body() dto: AskDto) {
    return this.socratic.ask(user.id, dto);
  }

  @Get('sessions')
  sessions(@CurrentUser() user: AuthUser) {
    return this.socratic.listSessions(user.id);
  }

  @Get('sessions/:id')
  session(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.socratic.getSession(user.id, id);
  }
}
