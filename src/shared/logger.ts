type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

/**
 * Structured logger for console output.
 * In production, this could be extended to write to files or external services.
 */
class Logger {
  private formatEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('info', message, context);
    console.log(JSON.stringify(entry));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('warn', message, context);
    console.warn(JSON.stringify(entry));
  }

  error(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatEntry('error', message, context);
    console.error(JSON.stringify(entry));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.DEBUG === 'true') {
      const entry = this.formatEntry('debug', message, context);
      console.log(JSON.stringify(entry));
    }
  }

  /**
   * Log a skipped offer with validation errors.
   * This is the primary method for logging invalid offers.
   */
  logSkippedOffer(
    providerName: string,
    offerId: string | undefined,
    errors: { field: string; message: string }[]
  ): void {
    this.warn('Skipped invalid offer', {
      provider: providerName,
      offerId: offerId ?? 'unknown',
      errors,
    });
  }
}

export const logger = new Logger();
