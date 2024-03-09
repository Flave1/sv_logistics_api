import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
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
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { getBaseUrl } from "src/utils";
import { Request } from "express";
import { DeleteDto } from 'src/dto/delete.dto';
import { GetUser } from 'src/auth/decorator';
import { CreateQrCodeDto } from './dto/qrcode.dto';
import { UserType } from './user/enums';

const restaurantDestination: string = './src/uploads/restaurant'
@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
    constructor(
        private restaurantService: RestaurantService,
    ) { }


    @Get('statistics')
    async getStatistics(@GetUser('restaurantId') restaurantId: string) {
        const response = await this.restaurantService.getDasboardStats(parseInt(restaurantId));
        return response;
    }

    @Get()
    // @UseInterceptors(CacheInterceptor) 
    // @CacheTTL(1000)
    async getRestaurant(@GetUser('id') userId: string, @GetUser('userTypeId') userTypeId: string) {
        if (parseInt(userTypeId) === UserType.SystemAdmin) {
            return await this.restaurantService.sys_getRestaurants();
        }
        if (parseInt(userTypeId) === UserType.Client) {
            return await this.restaurantService.getClientRestaurants(parseInt(userId));
        }
        else {
            return await this.restaurantService.getRestaurants();
        }
    }

    @Get(':id')
    async getRestaurantById(@Param('id', ParseIntPipe) restaurantId: number, @Req() req: Request) {
        const response = await this.restaurantService.getRestaurantById(restaurantId);
        response.restaurant.image = response?.restaurant?.image ? getBaseUrl(req) + '/' + response.restaurant.image : "";
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
    editRestaurantById(@UploadedFile() file, @Body() dto: EditRestaurantDto) {
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