import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressDto, CreateAddressDto, EditAddressDto } from '../dto/address.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser } from 'src/auth/decorator';

  
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() data: CreateAddressDto): Promise<AddressDto> {
    return this.addressService.create(data);
  }

  @Get()
  findAll(@GetUser('id') customerId): Promise<AddressDto[]> {
    return this.addressService.findAll(customerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AddressDto | null> {
    return this.addressService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: EditAddressDto): Promise<AddressDto | null> {
    return this.addressService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.addressService.remove(Number(id));
  }

  @Put(':id/set-default')
  setDefaultAddress(@Param('id') id: string, @GetUser('id') custommerId: number): Promise<EditAddressDto | null> {
    return this.addressService.setDefaultAddress(Number(id), custommerId);
  }
}
