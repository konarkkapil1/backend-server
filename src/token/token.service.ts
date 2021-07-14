import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/user/user.entity';
import { TOKEN } from 'config';

@Injectable()
export class TokenService {

    public generate(user: UserEntity) {
        let now = Date.now();
        let exp = now + (60 * 1);
        let key = TOKEN.secret;

        const payload = {
            iat: now,
            exp: exp,
            aud: user.email,
            sub: user.id,
            alg: 'RS256',
            iss: 'nestServer'
        }

        return jwt.sign(
            payload,
            key
        );
    }

}
