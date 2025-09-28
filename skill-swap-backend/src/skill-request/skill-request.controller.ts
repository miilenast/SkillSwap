import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SkillRequestService } from './skill-request.service';
import { CreateSkillRequestDto } from './dto/create-skill-request.dto';
import { UpdateSkillRequestDto } from './dto/update-skill-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('skill-request')
export class SkillRequestController {
  constructor(private readonly skillRequestService: SkillRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createSkillRequestDto: CreateSkillRequestDto,
    @Request() req: { user: User },
  ) {
    return this.skillRequestService.create(createSkillRequestDto, req.user);
  }

  @Get()
  findAll() {
    return this.skillRequestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillRequestService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSkillRequestDto: UpdateSkillRequestDto,
  ) {
    return this.skillRequestService.update(+id, updateSkillRequestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.skillRequestService.remove(+id);
  }
}
