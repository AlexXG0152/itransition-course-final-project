import { Module, forwardRef } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FirebaseController],
  providers: [FirebaseService],
  exports: [FirebaseModule],
  imports: [forwardRef(() => AuthModule)],
})
export class FirebaseModule {}
