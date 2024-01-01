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
    UploadedFile
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

    @Get()
    // @UseInterceptors(CacheInterceptor) 
    // @CacheTTL(1000)
    getRestaurant() {
        return this.restaurantService.getRestaurants();
    }

    @Get(':id')
    getRestaurantById(@Param('id', ParseIntPipe) restaurantId: number) {
        return this.restaurantService.getRestaurantById(restaurantId);
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
        return this.restaurantService.editRestaurantById(restaurantId, dto);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteRestaurantById(
        @Param('id', ParseIntPipe) restaurantId: number,
    ) {
        return this.restaurantService.deleteRestaurantById(restaurantId);
    }
}