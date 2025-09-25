import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkillRequestService } from './skill-request.service';
import { CreateSkillRequestDto } from './dto/create-skill-request.dto';
import { UpdateSkillRequestDto } from './dto/update-skill-request.dto';

@Controller('skill-request')
export class SkillRequestController {
  constructor(private readonly skillRequestService: SkillRequestService) {}

  @Post()
  create(@Body() createSkillRequestDto: CreateSkillRequestDto) {
    return this.skillRequestService.create(createSkillRequestDto);
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
  update(@Param('id') id: string, @Body() updateSkillRequestDto: UpdateSkillRequestDto) {
    return this.skillRequestService.update(+id, updateSkillRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillRequestService.remove(+id);
  }
}
