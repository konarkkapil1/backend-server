import { Body, Controller, Inject, Logger, Post, UnauthorizedException, Request, HttpCode } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenDto } from './Dto/Token.Dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Controller('token')
export class TokenController {
    constructor(
        private readonly tokenService: TokenService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ){}
    
    @HttpCode(200)
    @Post('refresh')
    async refresh(@Body() token: TokenDto, @Request() req) {
        const IP = req.connection.remoteAddress || req.headers['x-forwared-for'];

        this.logger.log('info', `{'CONTROLLER': 'TOKEN', 'ROUTE': 'REFRESH', 'METHOD': 'POST', 'IP': '${IP}'}`);

        if (!token.refresh_token || !token.access_token) {
            throw new UnauthorizedException("Unauthorized");
        }
        
        try{
            const newTokens: any = await this.tokenService.verifyAndGenerateTokens(token.access_token, token.refresh_token);
            
            return {token: newTokens}
        }catch(e) {
            this.logger.log('error', `{'CONTROLLER': 'TOKEN', 'ROUTE': 'REFRESH', 'METHOD': 'POST', 'IP': '${IP}'}, 'MESSAGE': '${e}'`);

            return new UnauthorizedException(e);
        }
    }
}