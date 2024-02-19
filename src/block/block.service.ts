import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './entities/block.entity';

@Injectable()
export class BlockService extends TypeOrmCrudService<Block> {
  constructor(@InjectRepository(Block) repository: Repository<Block>) {
    super(repository);
  }
}
