import { RoleName } from '@core/access-control/types';

import { UserCommand } from './UserCommand';

interface Params {
    publicId: string;
    name: string;
    role: RoleName;
}

export class UserCreateCommand extends UserCommand<Params> {

    public async execute(): Promise<void> {
        await this.userCrudService.create(this.params);
    }
}
