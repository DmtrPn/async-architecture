import { RoleName } from '@core/access-control/types';

import { UserCommand } from './UserCommand';

interface Params {
    publicId: string;
    name?: string;
    role?: RoleName;
}

export class UserUpdateCommand extends UserCommand<Params> {

    public async execute(): Promise<void> {
        const { publicId, name, role } = this.params;
        const id = await this.getUserIdByPublicId(publicId);
        await this.userCrudService.update(id, { name, role });
    }

}
