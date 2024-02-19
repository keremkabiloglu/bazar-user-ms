import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';

@Crud({
  model: {
    type: Device,
  },
})
@Controller('device')
export class DeviceController implements CrudController<Device> {
  constructor(public readonly service: DeviceService) {}
}
