import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { cleanupOpenApiDoc } from "nestjs-zod";
import helmet from "helmet";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: "http://localhost:5173", credentials: true },
  });
  app.use(helmet());
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle("Task management system")
    .setVersion("0.1")
    .addBearerAuth()
    .addGlobalResponse({
      status: 401,
      description: "Unauthorized",
      example: {
        message: "Unauthorized",
        statusCode: 401,
      },
    })
    .build();

  const documentFactory = () =>
    cleanupOpenApiDoc(SwaggerModule.createDocument(app, config));
  SwaggerModule.setup("api", app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
