import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'auth',
      entities: [User, Post],
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([User, Post]),
    JwtModule.register({
      secret: 'c91a5551ef9e09bb430f1dc32917aa8a3d25bf7ef9c5412783ae002b703ca0739fb66b2dcb4bbf47791649dce202d4c8d837c1d6ef08f2cc6269a24328a333fd', 
      signOptions: { expiresIn: '60m' }, 
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
