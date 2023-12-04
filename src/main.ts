import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configApi = new DocumentBuilder()
    .setTitle('Blog APIS')
    .setDescription('List API for simple blog')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Users')
    .addBearerAuth()
    .build();

  config.update({
    accessKeyId: 'AKIAREU7AUOTQQAJAJYU',
    secretAccessKey: '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',
    region: 'us-east-1',
    apiVersion: '2010-12-01',
  });

  const document = SwaggerModule.createDocument(app, configApi);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(8000);
}
bootstrap();

//  accessKeyId: 'AKIAREU7AUOTQQAJAJYU',
//  secretAccessKey: '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',

// new
// accessKeyId: 'AKIAREU7AUOT62XIMFM5',
//     secretAccessKey: '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',
