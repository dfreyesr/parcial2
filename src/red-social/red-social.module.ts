import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedSocialService } from './red-social.service';
import { RedSocialEntity } from './red-social.entity/red-social.entity';
import { RedSocialController } from './red-social.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RedSocialEntity])],
  providers: [RedSocialService],
  exports: [RedSocialService],
  controllers: [RedSocialController],
})
export class RedSocialModule {}
