import { EmailService } from '@chris.araneo/email-service';
import { HealthCheckService } from '@chris.araneo/health-check';
import { Logger } from '@chris.araneo/logger';
import Express from 'express';

(() => {
  const logger = new Logger('debug');
  const emailService = new EmailService(logger);
  const healthCheckService = new HealthCheckService(logger);
  const app = Express();

  app.post('/email', (request, response) =>
    emailService.handleRequest(request, response),
  );
  app.get('/health', (request, response) =>
    healthCheckService.handleRequest(request, response),
  );

  app.listen(5050);
})();
