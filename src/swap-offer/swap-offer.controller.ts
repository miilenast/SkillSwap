import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SwapOfferService } from './swap-offer.service';
import { CreateSwapOfferDto } from './dto/create-swap-offer.dto';
import { UpdateSwapOfferDto } from './dto/update-swap-offer.dto';

@Controller('swap-offer')
export class SwapOfferController {
  constructor(private readonly swapOfferService: SwapOfferService) {}

  @Post()
  create(@Body() createSwapOfferDto: CreateSwapOfferDto) {
    return this.swapOfferService.create(createSwapOfferDto);
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
  update(@Param('id') id: string, @Body() updateSwapOfferDto: UpdateSwapOfferDto) {
    return this.swapOfferService.update(+id, updateSwapOfferDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.swapOfferService.remove(+id);
  }
}
