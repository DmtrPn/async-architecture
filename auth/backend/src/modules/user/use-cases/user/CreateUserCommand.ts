import { UserStatus } from '@common/enums';
import { RoleName } from '@core/access-control/types';

import { UserCommand } from './UserCommand';

interface Params {
    publicId: string;
    name: string;
    email: string;
    status: UserStatus;
    password: string;
    role: RoleName;
}

export class CreateUserCommand extends UserCommand<Params> {

    public async run(): Promise<void> {
        await this.userCrudService.create(this.params);
    }
}
