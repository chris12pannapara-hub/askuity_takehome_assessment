export class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  info(message: string): void {
    console.log(`[INFO] ${this.getTimestamp()} - ${message}`);
  }

  debug(message: string, data?: any): void {
    if (data) {
      console.debug(`[DEBUG] ${this.getTimestamp()} - ${message}`, data);
    } else {
      console.debug(`[DEBUG] ${this.getTimestamp()} - ${message}`);
    }
  }

  error(message: string, error?: Error): void {
    if (error) {
      console.error(`[ERROR] ${this.getTimestamp()} - ${message}`, error.message);
      console.error(`Stack: ${error.stack}`);
    } else {
      console.error(`[ERROR] ${this.getTimestamp()} - ${message}`);
    }
  }

  warn(message: string): void {
    console.warn(`[WARN] ${this.getTimestamp()} - ${message}`);
  }
}

export const logger = new Logger();