import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';

@Crud({
  model: {
    type: Address,
  },
})
@Controller('address')
export class AddressController implements CrudController<Address> {
  constructor(public readonly service: AddressService) {}
}
