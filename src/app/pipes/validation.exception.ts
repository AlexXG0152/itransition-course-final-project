import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';

export class ValidationException extends HttpException {
  messages;
  constructor(response) {
    super(response, HttpStatus.BAD_REQUEST);
    this.message = response;
  }
}
