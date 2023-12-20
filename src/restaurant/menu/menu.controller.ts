import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtGuard } from "src/auth/guard";
import { GetUser } from "src/auth/decorator/get-user.decorator";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { CreateMenuCategoryDto } from "./dto/create.menu-category.dto";
import { diskStorage } from "multer";
import {v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { DeleteDto } from "src/dto/delete.dto";
import { UpdateMenuCategoryDto } from "./dto/update.menu-category.dto";
import { CreateMenuSubCategoryDto } from "./dto/create-menu-subcategory.dto";
import { UpdateMenuSubCategoryDto } from "./dto/update.menu-subcategory.dto";
import { CreateMenuDto } from "./dto/create.menu.dto";
import { UpdateMenuDto } from "./dto/update.menu.dto";

@ApiTags('Menu')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('menu')
export class MenuController {
    constructor(
       private menuService: MenuService
        ) {}

    @ApiCreatedResponse({ description: "Category successfully created" })
    @ApiOperation({ summary: 'Create category with an image, name and description' })
    @UseInterceptors(FileInterceptor('file',{
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
    @Post('create-category')
    createCategory(@GetUser('restaurantId') restaurantId: string, @UploadedFile() file, @Body() dto: CreateMenuCategoryDto) {
        return this.menuService.CreateRestaurantMenuCategory(restaurantId, file, dto);
    }

    @Get('restaurant-categories')
    getRestaurantCategories(@GetUser('restaurantId') restaurantId: string) {
        return this.menuService.getRestaurantMenuCategories(restaurantId);
    }

    @Get('restaurant-category/:id')
    getCategoryById(@GetUser('restaurantId') restaurantId: string, @Param('id') id: string) {
        return this.menuService.getRestaurantMenuCategoryById(restaurantId, id);
    }

    @Post('delete-category')
    deleteCategory(@GetUser('restaurantId') restaurantId: string, @Body() dto: DeleteDto) {
        return this.menuService.deleteRestaurantMenuCategoryById(restaurantId, dto);
    }

    @UseInterceptors(FileInterceptor('file',{
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


    @ApiCreatedResponse({ description: "Sub category successfully created" })
    @ApiOperation({ summary: 'Create sub category with an image, name and description' })
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './src/uploads/menu-subcategory',
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;

                cb(null, `${filename}${extension}`)
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Post('create-subcategory')
    createSubCategory(@GetUser('restaurantId') restaurantId: string, @UploadedFile() file, @Body() dto: CreateMenuSubCategoryDto) {
        return this.menuService.CreateRestaurantSubMenuCategory(restaurantId, file, dto);
    }

    @Get('restaurant-subcategories')
    getAllSubCategories(@GetUser('restaurantId') restaurantId: string) {
        return this.menuService.getRestaurantSubMenuCategories(restaurantId);
    }

    @Get('restaurant-subcategory/:id')
    getSubCategoryById(@GetUser('restaurantId') restaurantId: string, @Param('id') id: string) {
        return this.menuService.getRestaurantSubMenuCategoryById(restaurantId, id);
    }

    @Post('delete-subcategory')
    deleteSubCategory(@GetUser('restaurantId') restaurantId: string, @Body() dto: DeleteDto) {
        return this.menuService.deleteRestaurantSubMenuCategoryById(restaurantId, dto);
    }

    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './src/uploads/menu-subcategory',
            filename: (req, file, cb) => {
                const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;

                cb(null, `${filename}${extension}`)
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @Post('update-subcategory')
    updateSubCategory(@GetUser('restaurantId') restaurantId: string, @UploadedFile() file, @Body() dto: UpdateMenuSubCategoryDto) {
        return this.menuService.updateRestaurantSubMenuCategory(restaurantId, file, dto);
    }

    @ApiCreatedResponse({ description: "Menu successfully created" })
    @ApiOperation({ summary: 'Create menu with an image, name and description' })
    @UseInterceptors(FileInterceptor('file',{
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
    getAllMenu(@GetUser('restaurantId') restaurantId: string) {
        return this.menuService.getRestaurantMenu(restaurantId);
    }

    @Get('restaurant-menu/:id')
    getMenuById(@GetUser('restaurantId') restaurantId: string, @Param('id') id: string) {
        return this.menuService.getRestaurantMenuById(restaurantId, id);
    }

    @Post('delete-menu')
    deleteMenu(@GetUser('restaurantId') restaurantId: string, @Body() dto: DeleteDto) {
        return this.menuService.deleteRestaurantMenuById(restaurantId, dto);
    }

    @UseInterceptors(FileInterceptor('file',{
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