import { EmailService } from '@chris.araneo/email-service';
import { HealthCheckService } from '@chris.araneo/health-check';
import { Logger } from '@chris.araneo/logger';

(() => {
  const logger = new Logger('debug');

  new EmailService('/email', 5050, logger).listen();

  new HealthCheckService('/health', 9339, logger).listen();
})();
