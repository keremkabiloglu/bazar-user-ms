import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { Follower } from './entities/follower.entity';
import { FollowerService } from './follower.service';

@Crud({
  model: {
    type: Follower,
  },
})
@Controller('follower')
export class FollowerController implements CrudController<Follower> {
  constructor(public readonly service: FollowerService) {}
}
