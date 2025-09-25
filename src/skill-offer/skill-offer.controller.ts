import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SkillOfferService } from './skill-offer.service';
import { CreateSkillOfferDto } from './dto/create-skill-offer.dto';
import { UpdateSkillOfferDto } from './dto/update-skill-offer.dto';

@Controller('skill-offer')
export class SkillOfferController {
  constructor(private readonly skillOfferService: SkillOfferService) {}

  @Post()
  create(@Body() createSkillOfferDto: CreateSkillOfferDto) {
    return this.skillOfferService.create(createSkillOfferDto);
  }

  @Get()
  findAll() {
    return this.skillOfferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillOfferService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSkillOfferDto: UpdateSkillOfferDto) {
    return this.skillOfferService.update(+id, updateSkillOfferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.skillOfferService.remove(+id);
  }
}
