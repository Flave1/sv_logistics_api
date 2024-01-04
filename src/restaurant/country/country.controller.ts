import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { JwtGuard } from "src/auth/guard";
import { DeleteDto } from 'src/dto/delete.dto';

@ApiTags('Country')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('country')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Post('create')
    createCountry(@Body() dto: CreateCountryDto) {
        return this.countryService.CreateCountry(dto);
    }

    @Get('all')
    async getCountries() {
        return await this.countryService.getCountries();
    }

    @Get(':id')
    async getCountryById(@Param('id') id: string) {
        return await this.countryService.getCountryById(id);
    }

    @Post('update')
    updateCategory(@Body() dto: UpdateCountryDto) {
        return this.countryService.UpdateCountryById(dto);
    }

    @Post('delete')
    deleteCategory(@Body() dto: DeleteDto) {
        return this.countryService.deleteCountryById(dto);
    }
}