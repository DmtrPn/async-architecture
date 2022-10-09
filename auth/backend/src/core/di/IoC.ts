import { Container } from 'typescript-ioc';

import { IUserCrudService } from '@user/domain/user/IUserCrudService';
import { UserCrudService } from '@user/infrastructure/user/UserCrudService';
import { IJWTTokenService } from '@user/domain/auth/IJWTTokenService';
import { JWTTokenService } from '@user/infrastructure/auth/JWTTokenService';

Container.bind(IUserCrudService).to(UserCrudService);
Container.bind(IJWTTokenService).to(JWTTokenService);
