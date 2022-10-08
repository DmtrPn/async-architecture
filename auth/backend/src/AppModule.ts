import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { middlewares } from '@components/middlewares';
import { LocalStrategy, SessionSerializer } from '@components/auth/local';

import { UserModule } from '@user/UserModule';

@Module({
    imports: [
        PassportModule.register({ session: true, defaultStrategy: 'local' }),
        UserModule,
    ],
    providers: [LocalStrategy, SessionSerializer],
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer.apply(...middlewares).forRoutes('*');
    }
}
