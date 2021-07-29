import { Inject, Injectable, Logger, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TOKEN } from 'config/app.config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ){}
  
  async use(req: any, res: any, next: () => void) {
    //client ip address for logger
    const IP = req.connection.remoteAddress || req.headers['x-forwared-for'];

    this.logger.log('info', `{'MIDDLEWARE': 'AUTH', 'IP': '${IP}}'`);

    const accessToken = req.headers['x-access-token'];

    if (!accessToken) {
      this.logger.log('info', `{'MIDDLEWARE': 'AUTH', 'MESSAGE': 'access token not found', 'IP': '${IP}}' `);

      throw new UnauthorizedException("Unauthorized");
    }

    try{
      
      const user: any = jwt.verify(accessToken, TOKEN.access_token_secret);
      
      req.user = {
        id: user.sub,
        email: user.aud
      };

    }catch(error) {
      this.logger.log('error', `{'MIDDLEWARE': 'AUTH', 'MESSAGE': '${error}', 'IP': '${IP}'}`);

      throw new UnauthorizedException("Unauthorized");
    }
    
    next();
  }

}