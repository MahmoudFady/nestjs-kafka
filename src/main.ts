import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = app.get(ConfigService).get('server.port') as number;
  await app.listen(port);
  console.log('server listening on port ' + port);
}
bootstrap();
