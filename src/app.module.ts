import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '#/app.controller';
import { AppService } from '#/app.service';
import { commonConfig } from '#config/common.config';
import { swaggerConfig } from '#config/swagger.config';

import { SalonsModule } from '##salons/salons.module';

@Module({
  imports: [
    SalonsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [commonConfig, swaggerConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
