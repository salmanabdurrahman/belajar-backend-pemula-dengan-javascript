import express from 'express';
import errorHandler from './core/errors/error-handler.js';
import routes from './routes/index.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (request, response) => {
  response.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use(routes);

// 404 handler
app.use((request, response) => {
  response.status(404).json({
    status: 'failed',
    message: 'Endpoint not found',
    statusCode: 404,
  });
});

// Error handler middleware
app.use(errorHandler);

export default app;
