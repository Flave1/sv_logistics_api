import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guard";
import { GetUser } from "src/auth/decorator/get-user.decorator";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { CreateMenuCategoryDto } from "./dto/create.menu-category.dto";
import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { DeleteDto } from "src/dto/delete.dto";
import { UpdateMenuCategoryDto } from "./dto/update.menu-category.dto";
import { CreateMenuDto } from "./dto/create.menu.dto";
import { UpdateMenuDto } from "./dto/update.menu.dto";
import { Request } from "express";
import { getBaseUrl } from "src/utils";


const menuCategoryDestination: string = './src/uploads/menu-category'
const menuDestination: string = './src/uploads/menu'
let basePath: string = '';
@ApiTags('Menu')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('menu')
export class MenuController {
    constructor(
        private menuService: MenuService
    ) { }
    @HttpCode(HttpStatus.OK)
    @ApiCreatedResponse({ description: "Category successfully created" })
    @ApiOperation({ summary: 'Create category with an image, name and description' })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: menuCategoryDestination,
            filename: (req, file, cb) => {
                const filename: string = uuidv4();
                const extension: string = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`)
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Post('create-category')
    createCategory(@GetUser('restaurantId') restaurantId: string, @UploadedFile() file, @Body() dto: CreateMenuCategoryDto) {
        return this.menuService.CreateRestaurantMenuCategory(restaurantId, file, dto);
    }

    @Get('restaurant-categories')
    async getRestaurantCategories(@GetUser('restaurantId') restaurantId: string, @Req() req: Request) {
        const response = await this.menuService.getRestaurantMenuCategories(restaurantId);
        for (let i = 0; i < response.length; i++) {
            try {
                response[i].image = getBaseUrl(req) + '/' + response[i].image;
            } catch (error) {
                response[i].image = ''
            }

        }
        return response;
    }

    @Get('restaurant-category/:id')
    async getCategoryById(@GetUser('restaurantId') restaurantId: string, @Param('id') id: string, @Req() req: Request) {
        const response = await this.menuService.getRestaurantMenuCategoryById(restaurantId, id);
        try {
            response.image   = getBaseUrl(req) + '/' + response.image;
        } catch (error) {
            response.image = ''
        }
        return response;
    }

    @Post('delete-category')
    deleteCategory(@GetUser('restaurantId') restaurantId: string, @Body() dto: DeleteDto) {
        return this.menuService.deleteRestaurantMenuCategoryById(restaurantId, dto);
    }

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/uploads/menu-category',
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;

                cb(null, `${filename}${extension}`)
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Post('update-category')
    updateCategory(@GetUser('restaurantId') restaurantId: string, @UploadedFile() file, @Body() dto: UpdateMenuCategoryDto) {
        return this.menuService.updateRestaurantMenuCategory(restaurantId, file, dto);
    }

    @ApiCreatedResponse({ description: "Menu successfully created" })
    @ApiOperation({ summary: 'Create menu with an image, name and description' })
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/uploads/menu',
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;

                cb(null, `${filename}${extension}`)
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Post('create-menu')
    createMenu(@GetUser('restaurantId') restaurantId: string, @UploadedFile() file, @Body() dto: CreateMenuDto) {
        return this.menuService.CreateRestaurantMenu(restaurantId, file, dto);
    }

    @Get('restaurant-menu')
    async getAllMenu(@GetUser('restaurantId') restaurantId: string, @Req() req: Request) {
        const response = await this.menuService.getRestaurantMenu(restaurantId);
        for (let i = 0; i < response.length; i++) {
            response[i].image = getBaseUrl(req) + '/' + response[i].image
        }
        return response;
    }

    @Get('restaurant-menu/:id')
    async getMenuById(@GetUser('restaurantId') restaurantId: string, @Param('id') id: string, @Req() req: Request) {
        const response = await this.menuService.getRestaurantMenuById(restaurantId, id);
        try {
            response.image   = getBaseUrl(req) + '/' + response.image;
        } catch (error) {
            response.image = ''
        }
        return response;
    }

    @Get('restaurant-menu/category/:categoryId')
    async getMenuByCategoryId(@GetUser('restaurantId') restaurantId: string, @Param('categoryId') categoryId: string, @Req() req: Request) {
        const response = await this.menuService.getRestaurantMenuByCategoryId(restaurantId, categoryId);
        for (let i = 0; i < response.length; i++) {
            response[i].image = getBaseUrl(req) + '/' + response[i].image
        }
        return response;
    }

    @Post('delete-menu')
    deleteMenu(@GetUser('restaurantId') restaurantId: string, @Body() dto: DeleteDto) {
        return this.menuService.deleteRestaurantMenuById(restaurantId, dto);
    }

    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './src/uploads/menu',
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;

                cb(null, `${filename}${extension}`)
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Post('update-menu')
    updateMenu(@GetUser('restaurantId') restaurantId: string, @UploadedFile() file, @Body() dto: UpdateMenuDto) {
        return this.menuService.updateRestaurantMenu(restaurantId, file, dto);
    }
}