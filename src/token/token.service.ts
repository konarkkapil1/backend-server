import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/user/user.entity';
import { TOKEN } from 'config/app.config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TokenService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly UserRepository: Repository<UserEntity>
    ) {}

    public generateTokens(user: UserEntity) {
        
        return {
            access_token: this.generateAccessToken(user),
            refresh_token: this.generateRefreshToken(user)
        };
    }

    private generateAccessToken(user: UserEntity) {
        let now = Math.floor(Date.now() / 1000);
        let exp = now + (60);
        let key = TOKEN.access_token_secret;
        
        const payload: object = {
            iat: now,
            exp: exp,
            aud: user.email,
            sub: user.id,
            alg: 'RS256',
            iss: TOKEN.token_issuer
        }
        
        return jwt.sign(
            payload,
            key
        );
        
    }

    private generateRefreshToken(user: UserEntity) {
        let now = Math.floor(Date.now() / 1000);
        let exp = now + (60 * 60 * 24 * 7 * 4);
        let key = TOKEN.refresh_token_secret;
        
        const payload: object = {
            iat: now,
            exp: exp,
            aud: user.email,
            sub: user.id,
            alg: 'RS256',
            iss: TOKEN.token_issuer
        }
        
        return jwt.sign(
            payload,
            key
        );
    }

    // generates new access and refresh token if access token expires
    // throws error if both tokens are expired
    public async verifyAndGenerateTokens(access_token: any, refresh_token: any): Promise<object | Error> {
        try{
            const isRefreshTokenValid = jwt.verify(refresh_token, TOKEN.refresh_token_secret);

            const userFromToken: any = jwt.decode(access_token);
            
            const user: UserEntity = await this.UserRepository.findOne({email: userFromToken.aud});

            if (!user) {
                throw new Error("user not found");
            }
            
            return this.generateTokens(user);

        }catch(error) {
            throw new Error(error);
        }
    }
}
