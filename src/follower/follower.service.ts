import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follower } from './entities/follower.entity';

@Injectable()
export class FollowerService extends TypeOrmCrudService<Follower> {
  constructor(@InjectRepository(Follower) repository: Repository<Follower>) {
    super(repository);
  }
}
