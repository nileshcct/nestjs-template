import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport: {
          targets: [
            // 1. Output to Console (Formatted for Dev, JSON for Prod)
            {
              target: 'pino-pretty', // Install with: npm install pino-pretty
              options: { destination: 1 }, // 1 is stdout
              level: 'info',
            },
            // 2. Output to Local File with Rotation
            {
              target: 'pino-roll',
              options: {
                file: 'logs/app.log',
                frequency: 'daily',
                size: '10m', // Rotate every 10MB
                mkdir: true,
                limit: {
                  count: 14, // Keep logs for 14 days
                },
              },
              level: 'info',
            },
          ],
        }
      },
    }),
  ],
})
export class LoggerModule {}
