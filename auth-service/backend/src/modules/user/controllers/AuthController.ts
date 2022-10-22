import { Controller, Get, Post, Put, Req, Res, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Inject } from 'typescript-ioc';

import { LoginForm } from '@aa/types/backend';

import { Public } from '@components/decorators';
import { LoginUserCommand } from '@user/use-cases/auth';

import { AuthUserResponse } from './responces/AuthUserResponse';
import { IJWTTokenService } from '@user/domain/auth/IJWTTokenService';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {

    @Inject private tokenService: IJWTTokenService;

    @Public()
    @ApiOkResponse({ type: AuthUserResponse })
    @Post('/login')
    public async login(
        @Req() request,
        @Res() response,
        @Body() { user: loginData }: LoginForm,
    ): Promise<{ token: string } | any> {
        await new LoginUserCommand(loginData).execute();

        const token = await this.tokenService.create(loginData.email);

        request.login(token, (err, req_) => err
            ? response.status(401).send('<h1>Login Failure</h1>')
            : response.status(200).send({ token }));
    }

    @Public()
    @ApiOkResponse({ type: AuthUserResponse })
    @Get('/user/:token')
    public async getUserByToken(
        @Req() req,
        @Param('token') token: string,
        // Query - bad place for secret
        @Query('secret') secret: string,
    ): Promise<AuthUserResponse> {
        const user = await this.tokenService.decode(token, secret);
        return { user };
    }

    @Public()
    @ApiOkResponse({ type: AuthUserResponse })
    @Get('/user')
    public async getAuthorizedUser(
        @Req() req,
    ): Promise<AuthUserResponse> {

        return { user: req.user };
    }

    @Public()
    @Put('/logout')
    public async logout(
        @Req() req,
        @Res() res,
    ): Promise<any> {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    }

}
