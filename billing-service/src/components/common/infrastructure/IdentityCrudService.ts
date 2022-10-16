import { FindOptionsWhere } from 'typeorm';

import { CrudService } from '@common/infrastructure/CrudService';

export abstract class IdentityCrudService<
    M extends object & { id: string | number },
    CreationParams extends Partial<M>,
    UpdateParams extends Partial<M>,
    FO extends object = {},
> extends CrudService<M, CreationParams, UpdateParams, FO> {

    public async getById(id: string | number): Promise<M | undefined> {
        return this.manager.findOneBy<M>(this.modelClass, { id } as FindOptionsWhere<M>);
    }

    public async remove(id: string | number): Promise<void> {
        await this.manager.delete(this.modelClass, { id });
    }
}