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
import { SwapOfferService } from './swap-offer.service';
import { CreateSwapOfferDto } from './dto/create-swap-offer.dto';
import { UpdateSwapOfferDto } from './dto/update-swap-offer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';

@Controller('swap-offer')
export class SwapOfferController {
  constructor(private readonly swapOfferService: SwapOfferService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createSwapOfferDto: CreateSwapOfferDto,
    @Request() req: { user: User },
  ) {
    return this.swapOfferService.create(createSwapOfferDto, req.user);
  }

  @Get()
  findAll() {
    return this.swapOfferService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.swapOfferService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSwapOfferDto: UpdateSwapOfferDto,
  ) {
    return this.swapOfferService.update(+id, updateSwapOfferDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.swapOfferService.remove(+id);
  }
}
