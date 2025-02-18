import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalonsModule } from './modules/salons/salons.module';

@Module({
  imports: [SalonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
