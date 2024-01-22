import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Req
} from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express/multer";

import { JwtGuard } from '../auth/guard';
import { RestaurantService } from './restaurant.service';
import {
    CreateRestaurantDto,
    EditRestaurantDto,
} from './dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { getBaseUrl } from "src/utils";
import { Request } from "express";
import { DeleteDto } from 'src/dto/delete.dto';
import { GetUser } from 'src/auth/decorator';
import { CreateQrCodeDto } from '../customer/dto/create-qrcode.dto';

const restaurantDestination: string = './src/uploads/restaurant'
let basePath: string = '';
@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
    constructor(
        private restaurantService: RestaurantService,
    ) { }

    @Get('all')
    // @UseInterceptors(CacheInterceptor) 
    // @CacheTTL(1000)
    async getRestaurant(@Req() req: Request) {
        const response = await this.restaurantService.getRestaurants();
        for (let i = 0; i < response.length; i++) {
            response[i].image = getBaseUrl(req) + '/' + response[i].image
        }
        return response;
    }

    @Get(':id')
    async getRestaurantById(@Param('id', ParseIntPipe) restaurantId: number, @Req() req: Request) {
        const response = await this.restaurantService.getRestaurantById(restaurantId);
        response.image = getBaseUrl(req) + '/' + response.image

        return response;
    }

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: restaurantDestination,
            filename: (req, file, cb) => {
                const filename: string = uuidv4();
                const extension: string = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`)
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Post('create')
    createRestaurant(@UploadedFile() file, @Body() dto: CreateRestaurantDto) {
        return this.restaurantService.createRestaurant(dto, file);
    }

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: restaurantDestination,
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;

                cb(null, `${filename}${extension}`)
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Post('update')
    editRestaurantById(
        @UploadedFile() file, 
        @Body() dto: EditRestaurantDto,
    ) {
        return this.restaurantService.editRestaurantById(dto, file);
    }

    @Post('delete')
    deleteRestaurant(@Body() dto: DeleteDto) {
        return this.restaurantService.deleteRestaurantById(dto);
    }

  @Post('create-qrcode')
  async createQrCode(@GetUser('restaurantId') restaurantId: string, @Body() dto: CreateQrCodeDto, @Req() req: Request) {
    return this.restaurantService.CreateQrCode(restaurantId, dto, req);
  }
}