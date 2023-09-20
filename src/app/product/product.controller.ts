import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RateProductDto } from './dto/rate-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UnRateProductDto } from './dto/unrate-product.dto';
import { CategoryService } from './category.service';
import { SubcategoryService } from './subcategory.service';
import { RatingService } from './rating.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly categoryService: CategoryService,
    private readonly subcategoryService: SubcategoryService,
    private readonly ratingService: RatingService,
  ) {}

  @ApiOperation({ summary: 'Create Product' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Get all Products' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Get one Product' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOneByID(@Param('id') id: string) {
    return this.productService.findOneByID(+id);
  }

  @ApiOperation({ summary: 'Search Product' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get('/search/:name')
  findOneByName(@Param('name') name: string) {
    return this.productService.findOneByTitle(name);
  }

  @ApiOperation({ summary: 'Update Product' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete Product' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @ApiOperation({ summary: 'Rate Product' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/rate')
  rate(@Req() req: Request, @Body() rateProductDto: RateProductDto) {
    return this.ratingService.rateProduct(req, rateProductDto);
  }

  @ApiOperation({ summary: 'UnRate Product' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/unrate')
  unrate(@Req() req: Request, @Body() unRateProductDto: UnRateProductDto) {
    return this.ratingService.unrateProduct(req, unRateProductDto);
  }

  @ApiOperation({ summary: 'Create Category' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/category')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @ApiOperation({ summary: 'Create Subcategory' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/subcategory')
  createSubcategory(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.createSubcategory(createSubcategoryDto);
  }

  @ApiOperation({ summary: 'Find all Categories' })
  @ApiResponse({ status: 200 })
  @Get('/category/all')
  findAllCategory() {
    return this.categoryService.findAllCategory();
  }

  @ApiOperation({ summary: 'Find all Subcategories' })
  @ApiResponse({ status: 200 })
  @Get('/subcategory/all')
  findAllSubcategory() {
    return this.subcategoryService.findAllSubcategory();
  }
}
