import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './auth.middleware';
import { TokenModule } from './token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB } from 'config/app.config';
import { WinstonModule } from 'nest-winston';
import loggerConfig  from 'config/logger.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: DB.type,
      host: DB.host,
      port: DB.port,
      username: DB.username,
      password: DB.password,
      database: DB.database,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    WinstonModule.forRoot(loggerConfig),
    UserModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(AuthMiddleware)
    .exclude(
      {path: 'api', method: RequestMethod.ALL},
      {path: 'api/user/signup', method: RequestMethod.POST},
      {path: 'api/user/login', method: RequestMethod.POST},
    )
    .forRoutes({path: '*', method: RequestMethod.ALL});
  }
}
