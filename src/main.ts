import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: true,
        sameSite: 'none',
      },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_URL,
    credentials: true
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
