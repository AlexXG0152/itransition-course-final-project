import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  HttpStatus,
  ParseFilePipeBuilder,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Firebase')
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  @ApiOperation({ summary: 'Upload picture to cloud storage' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/upload')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      limits: { fileSize: 5242880 },
    }),
  )
  uploadFile(
    @Body() body: any,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg||jpg||png',
        })
        .addMaxSizeValidator({
          maxSize: 5242880,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.firebaseService.upload(files);
  }

  @ApiOperation({ summary: 'Delete picture from cloud storage' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.firebaseService.remove(name);
  }
}
