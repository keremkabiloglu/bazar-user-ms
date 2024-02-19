import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { BlockService } from './block.service';
import { Block } from './entities/block.entity';

@Crud({
  model: {
    type: Block,
  },
})
@Controller('block')
export class BlockController implements CrudController<Block> {
  constructor(public readonly service: BlockService) {}
}
