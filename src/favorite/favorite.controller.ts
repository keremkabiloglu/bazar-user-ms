import { Crud, CrudController } from '@dataui/crud';
import { Controller } from '@nestjs/common';
import { Favorite } from './entities/favorite.entity';
import { FavoriteService } from './favorite.service';

@Crud({
  model: {
    type: Favorite,
  },
})
@Controller('favorite')
export class FavoriteController implements CrudController<Favorite> {
  constructor(public readonly service: FavoriteService) {}
}
