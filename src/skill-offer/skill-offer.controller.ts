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
import { SkillOfferService } from './skill-offer.service';
import { CreateSkillOfferDto } from './dto/create-skill-offer.dto';
import { UpdateSkillOfferDto } from './dto/update-skill-offer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('skill-offer')
export class SkillOfferController {
  constructor(private readonly skillOfferService: SkillOfferService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createSkillOfferDto: CreateSkillOfferDto,
    @Request() req: { user: User },
  ) {
    return this.skillOfferService.create(createSkillOfferDto, req.user);
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
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSkillOfferDto: UpdateSkillOfferDto,
  ) {
    return this.skillOfferService.update(+id, updateSkillOfferDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.skillOfferService.remove(+id);
  }
}
