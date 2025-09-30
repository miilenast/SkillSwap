/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  BadRequestException,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { SkillRequestService } from './skill-request.service';
import { CreateSkillRequestDto } from './dto/create-skill-request.dto';
import { UpdateSkillRequestDto } from './dto/update-skill-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { SkillRequest } from './entities/skill-request.entity';
import { SkillCategory } from 'src/enums/skill-category.enum';

@Controller('skill-request')
export class SkillRequestController {
  constructor(private readonly skillRequestService: SkillRequestService) {}

  @Get('nearby/:userId')
  async getNearbyRequests(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<SkillRequest[]> {
    try {
      return await this.skillRequestService.getNearbyRequests(userId);
    } catch (err) {
      console.error('Greška pri dohvatanju requestova:', err);
      throw new Error('Internal Server Error');
    }
  }

  @Get('nearby/:userId/category/:category')
  async getNearbyRequestsByCategory(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('category') category: SkillCategory,
  ): Promise<SkillRequest[]> {
    return this.skillRequestService.getNearbyRequestsByCategory(
      userId,
      category,
    );
  }

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

  @UseGuards(JwtAuthGuard)
  @Get(`my-requests`)
  getMyRequests(@Req() req: any) {
    return this.skillRequestService.findByUser(req.user?.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const requestId = Number(id);
    if (isNaN(requestId)) {
      throw new BadRequestException('Nevalidan ID zahteva');
    }
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
