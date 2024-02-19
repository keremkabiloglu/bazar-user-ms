import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from './entities/device.entity';

@Injectable()
export class DeviceService extends TypeOrmCrudService<Device> {
  constructor(
    @InjectRepository(Device)
    repository: Repository<Device>,
  ) {
    super(repository);
  }
}
