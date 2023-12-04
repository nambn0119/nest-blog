"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const aws_sdk_1 = require("aws-sdk");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configApi = new swagger_1.DocumentBuilder()
        .setTitle('Blog APIS')
        .setDescription('List API for simple blog')
        .setVersion('1.0')
        .addTag('Auth')
        .addTag('Users')
        .addBearerAuth()
        .build();
    aws_sdk_1.config.update({
        accessKeyId: 'AKIAREU7AUOTQQAJAJYU',
        secretAccessKey: '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',
        region: 'us-east-1',
        apiVersion: '2010-12-01',
    });
    const document = swagger_1.SwaggerModule.createDocument(app, configApi);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.enableCors();
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map