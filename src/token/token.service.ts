import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity';
import * as uuid from 'uuid';

@Injectable()
export class TokenService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(TokenEntity) private readonly tokenRepository: Repository<TokenEntity>
    ) {}

    public async generateTokens(user: UserEntity): Promise<Object | Error> {

        let now = Math.floor(Date.now() / 1000);
        let tokenId = uuid.v4();

        const accessToken = this.generateAccessToken(user, now, tokenId);
        const refreshToken = this.generateRefreshToken(user, now, tokenId);

        const token = {
            user: user.id,
            tokenId: tokenId,
            iat: now,
            exp: now + (60 * 60 * 24 * 7 * 4),
        };
        
        try {
            await this.tokenRepository.save(token);
        }catch(error) {
            throw new Error(error);
        }
        
        return {
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    private generateAccessToken(user: UserEntity, date: number, id: string) {
        let exp = date + (60);
        let key = process.env.ACCESS_TOKEN_SECRET;
        
        const payload: object = {
            iat: date,
            exp: exp,
            aud: user.email,
            sub: user.id,
            id: id,
            alg: 'RS256',
            iss: process.env.TOKEN_ISSUER
        }
        
        return jwt.sign(
            payload,
            key
        );
        
    }

    private generateRefreshToken(user: UserEntity, date: number, id: string) {
        let exp = date + (60 * 60 * 24 * 7 * 4);
        let key = process.env.REFRESH_TOKEN_SECRET;
        
        const payload: object = {
            iat: date,
            exp: exp,
            aud: user.email,
            sub: user.id,
            id: id,
            alg: 'RS256',
            iss: process.env.TOKEN_ISSUER
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
            jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

            const userFromToken: any = jwt.decode(access_token);

            const isRefreshTokenInDb = await this.tokenRepository.findOne({user: userFromToken.sub});

            if (!isRefreshTokenInDb) {
                throw new Error("Unauthenticated");
            }

            await this.tokenRepository.delete({user: userFromToken.sub});
            
            const user: UserEntity = await this.userRepository.findOne({email: userFromToken.aud});

            if (!user) {
                throw new Error("user not found");
            }
            
            return this.generateTokens(user);

        }catch(error) {
            throw new Error(error);
        }
    }
}
