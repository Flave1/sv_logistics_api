

import {
    Body,
    Controller,
    Post,
    UseGuards,
    Get
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { JwtGuard } from 'src/auth/guard';
import { CreateClientDto } from './dto/create-client.dto';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) { }

  @ApiBearerAuth()
  @ApiCreatedResponse({ description: "Client successfully created" })
  @UseGuards(JwtGuard)
  @Post('create-client')
  createClient(@Body() dto: CreateClientDto) {
    return this.clientService.CreateClient(dto);
  }

  @Get('all')
  getClients() {
    return this.clientService.getClients();
  }
}