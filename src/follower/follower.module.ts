import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follower } from './entities/follower.entity';
import { FollowerController } from './follower.controller';
import { FollowerService } from './follower.service';

@Module({
  imports: [TypeOrmModule.forFeature([Follower])],
  controllers: [FollowerController],
  providers: [FollowerService],
  exports: [FollowerService],
})
export class FollowerModule {}
