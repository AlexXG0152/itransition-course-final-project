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
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Review } from './entities/review.entity';
import { Comment } from '../comments/entities/comment.entity';
import { FullTextSearchService } from './full-text-search.service';
import { TagsService } from './tags.service';
import { LikesService } from './likes.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly fullTextSearchService: FullTextSearchService,
    private readonly tagsService: TagsService,
    private readonly likesService: LikesService,
  ) {}

  @ApiOperation({ summary: 'Create Review' })
  @ApiResponse({ status: 201, type: Review })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req, createReviewDto);
  }

  @ApiOperation({ summary: 'Get All Review' })
  @ApiResponse({ status: 200, type: Review })
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiOperation({ summary: 'Get All Review by Query params' })
  @ApiResponse({ status: 200, type: Review })
  @Get('/list')
  getReviewsByParams(@Query() params: any) {
    return this.reviewsService.getReviewsByParams(params);
  }

  @ApiOperation({ summary: 'Get All Reviews By Tag Name' })
  @ApiResponse({ status: 200, type: Review })
  @Get('/tags')
  getReviewsByTagName(@Query() params: any) {
    return this.tagsService.getReviewsByTag(params);
  }

  @ApiOperation({ summary: 'Get ONE Review by ID' })
  @ApiResponse({ status: 200, type: Review })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update Review' })
  @ApiResponse({ status: 200, type: Review })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @ApiOperation({ summary: 'Delete Review' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }

  @ApiOperation({ summary: 'Like Review' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get(':id/like')
  likeReview(@Param('id') reviewID: number, @Req() req: Request) {
    return this.likesService.likeReview(reviewID, req);
  }

  @ApiOperation({ summary: 'Is User Like Review?' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Get(':id/isLiked/:userId')
  isLiked(@Param('id') reviewID: number, @Param('userId') userId: number) {
    return this.likesService.checkIfUserGaveLike(reviewID, userId);
  }

  @ApiOperation({ summary: 'Find All Reviews By FullText Search' })
  @ApiResponse({ status: 200, type: Review && Comment })
  @Get('/search/:query')
  findAllByFullTextSearch(@Param('query') query: string) {
    return this.fullTextSearchService.findAllByFullTextSearch(query);
  }

  @ApiOperation({ summary: 'Get 20 most popular tags' })
  @ApiResponse({ status: 200, type: Review && Comment })
  @Get('/searchTags/getPopularTags')
  getPopularTags() {
    return this.tagsService.getPopularTags();
  }

  @ApiOperation({ summary: 'Search tags' })
  @ApiResponse({ status: 200, type: Review && Comment })
  @Get('/searchTags/:query')
  searchTags(@Param('query') query: string) {
    return this.tagsService.searchTags(query);
  }
}
