import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get()
  findAll() {
    return this.activities.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activities.findOne(id);
  }
}
