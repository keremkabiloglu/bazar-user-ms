import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService extends TypeOrmCrudService<Address> {
  constructor(@InjectRepository(Address) repository: Repository<Address>) {
    super(repository);
  }
}
