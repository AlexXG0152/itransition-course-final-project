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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Review } from './entities/review.entity';
import { Comment } from '../comments/entities/comment.entity';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Create Review' })
  @ApiResponse({ status: 201, type: Review })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(req, createReviewDto);
  }

  @ApiOperation({ summary: 'Get All Review' })
  @ApiResponse({ status: 200, type: Review })
  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiOperation({ summary: 'Get ONE Review by ID' })
  @ApiResponse({ status: 200, type: Review })
  // @UseGuards(JwtAuthGuard)
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
  @Post(':id/like')
  likeReview(@Param('id') reviewID: number, @Req() req: Request) {
    return this.reviewsService.likeReview(reviewID, req);
  }

  @ApiOperation({ summary: 'Find All Reviews By FullText Search' })
  @ApiResponse({ status: 200, type: Review && Comment })
  @Get('/search/:query')
  findAllByFullTextSearch(@Param('query') query: string) {
    return this.reviewsService.findAllByFullTextSearch(query);
  }
}
