import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatusService } from './status.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stories')
export class StatusController {
  constructor(private readonly status: StatusService) {}

  @Get()
  list() {
    return this.status.list();
  }
}
