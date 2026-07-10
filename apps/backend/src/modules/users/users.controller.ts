import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateChildDto } from './dto/create-child.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, type AuthUser } from '../../common/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.users.getProfile(user.id);
  }

  @Patch('me')
  update(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(user.id, dto);
  }

  /* ----------------------- Comptes enfants (parent) ---------------------- */

  @Get('children')
  children(@CurrentUser() user: AuthUser) {
    return this.users.listChildren(user.id);
  }

  @Post('children')
  addChild(@CurrentUser() user: AuthUser, @Body() dto: CreateChildDto) {
    return this.users.createChild(user.id, dto);
  }

  @Delete('children/:id')
  removeChild(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.users.deleteChild(user.id, id);
  }

  @Post('children/:id/token')
  childToken(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.users.childToken(user.id, id);
  }
}
