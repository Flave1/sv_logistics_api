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

@ApiTags('Menu')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller()
export class MenuController {
    constructor(
       private menuService: MenuService
        ) {}

    @ApiCreatedResponse({ description: "Category successfully created" })
    @ApiOperation({ summary: 'Create category with an image, name and description' })
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './uploads/menu-category',
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
        return this.menuService.CreateCategory(restaurantId, file, dto);
    }

    @Get('categories')
    getAllCategories(@GetUser('restaurantId') restaurantId: string) {
        return this.menuService.getAllCategories(restaurantId);
    }

    @Get('category/:id')
    getCategoryById(@GetUser('restaurantId') restaurantId: string, @Param('id') id: string) {
        return this.menuService.getCategoryById(restaurantId, id);
    }

    @Post('delete-category')
    deleteCategory(@GetUser('restaurantId') restaurantId: string, @Body() dto: DeleteDto) {
        return this.menuService.deleteCategoryById(restaurantId, dto);
    }

    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: './uploads/menu-category',
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
        return this.menuService.updateCategory(restaurantId, file, dto);
    }
}