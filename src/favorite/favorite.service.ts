import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoriteService extends TypeOrmCrudService<Favorite> {
  constructor(@InjectRepository(Favorite) repository: Repository<Favorite>) {
    super(repository);
  }
}
