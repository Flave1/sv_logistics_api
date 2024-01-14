import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerWebService } from './customerweb.service';
import { GetUser } from 'src/auth/decorator';
import { CreateQrCodeDto } from './dto/create-qrcode.dto';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';
import { getBaseUrl } from 'src/utils';

ApiTags('Customerweb');
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('Customerweb')
export class CustomerwebController {
  constructor(private customerWebService: CustomerWebService) {}

  @Post('create-restaurant-qrcode')
  async createQrCode(@GetUser('restaurantId') restaurantId: string, @Body() dto: CreateQrCodeDto, @Req() req: Request) {
    return this.customerWebService.CreateQrCode(restaurantId, dto, req);
  }

  @Get('restaurant-qrcodes')
  async getRestaurantQrCodes(@GetUser('restaurantId') restaurantId: string, @Req() req: Request) {
    const response = await this.customerWebService.getRestaurantQrCodes(restaurantId);
    
    try {
      response.qrCode = getBaseUrl(req) + '/' + response.qrCode;
    } catch (error) {
      response.qrCode = '';
    }
    return response;
  }

  @Get('restaurant-qrcode/:id')
  async getRestaurantQrCodeById(@GetUser('restaurantId') restaurantId: string, @Req() req: Request, @Param('id') id: string) {
    const response = await this.customerWebService.getRestaurantQrCodeById(restaurantId, id);
    // for (let i = 0; i < response.length; i++) {
    //   try {
    //     response.qrCode = getBaseUrl(req) + '/' + response.qrCode;
    //   } catch (error) {
    //     response.qrCode = '';
    //   }
    // }
    return response;
  }
}
