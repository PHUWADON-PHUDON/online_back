import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.set('trust proxy', 1);
  
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET as string || "my-secret",
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
  app.use((req:any, res:any, next:any) => {
    console.log('SESSION CHECK:', req.session);
    next();
  });

  app.enableCors({
    origin: "https://xoonlinefront.vercel.app",//process.env.CORS_URL
    credentials: true
  });

  // ✅ ตั้งค่า CORS ให้กับ Socket.IO ด้วย
  const server = app.getHttpServer();
  const io = require('socket.io')(server, {
    cors: {
      origin: 'https://xoonlinefront.vercel.app',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: any) => {
    console.log('⚡ Client connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
    });
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
