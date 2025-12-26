import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import path from 'path';
import mongoose from 'mongoose';
import { DB_ADDRESS, PORT } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error-handler';
import { requestLogger, errorLogger } from './middlewares/logger';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Раздача статических файлов
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Логгер запросов (подключаем ДО роутов)
app.use(requestLogger);

// Подключение к MongoDB
mongoose.connect(DB_ADDRESS)
  .then(() => {
    // Используем стандартный вывод, так как логгер еще не настроен для этого
    // В production можно использовать process.stdout.write или специализированный логгер
    process.stdout.write('Успешное подключение к MongoDB\n');
  })
  .catch((err: Error) => {
    process.stderr.write(`Ошибка подключения к MongoDB: ${err.message}\n`);
    process.exit(1);
  });

// Роуты
app.use('/', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Корневой маршрут
app.get('/', (_req, res) => {
  res.json({
    message: 'API WebLarek',
    version: '1.0.0',
    endpoints: {
      products: '/product',
      order: '/order',
      health: '/health',
    },
  });
});

// Логгер ошибок (подключаем ПОСЛЕ роутов и ДО обработчиков ошибок)
app.use(errorLogger);

// Обработка ошибок celebrate
app.use(errors());

// Обработка 404 ошибок
app.use(notFoundHandler);

// Централизованная обработка ошибок
app.use(errorHandler);

// Запуск сервера (перенесено из server.ts)
app.listen(PORT, () => {
  process.stdout.write(`Сервер запущен на порту ${PORT}\n`);
});

export default app;
