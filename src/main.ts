import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }))
  
  const options = new DocumentBuilder().setTitle("Teste Técnocp GCB - Desenvolvedor Back-end").setDescription("API para cadastro de médicos e visualização de médicos.").setVersion("1.0").addTag("doctors").addTag("specialties").build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
