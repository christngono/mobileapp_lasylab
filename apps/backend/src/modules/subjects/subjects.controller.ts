import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjects: SubjectsService) {}

  @Get()
  findAll() {
    return this.subjects.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjects.findOne(id);
  }
}
