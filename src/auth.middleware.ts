import { Injectable, InternalServerErrorException, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TOKEN } from 'config/app.config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  
  use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedException("Unauthorized");
    }

    try{
      
      const user: any = jwt.verify(token, TOKEN.secret);
      
      req.user = {
        id: user.sub,
        email: user.aud
      };

    }catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    
    next();
  }

}
