import { Container } from 'typescript-ioc';

import { IUserCrudService } from '@user/domain/user/IUserCrudService';
import { UserCrudService } from '@user/infrastructure/user/UserCrudService';

Container.bind(IUserCrudService).to(UserCrudService);
