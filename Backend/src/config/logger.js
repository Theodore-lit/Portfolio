// Simple Logger Configuration
// Vous pouvez remplacer par Winston ou Pino pour une meilleure logging

class Logger {
  log(level, message, data = '') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`, data);
  }

  info(message, data) {
    this.log('INFO', message, data);
  }

  error(message, data) {
    console.error(`[${new Date().toISOString()}] [ERROR] ${message}`, data);
  }

  warn(message, data) {
    this.log('WARN', message, data);
  }

  debug(message, data) {
    if (process.env.NODE_ENV === 'development') {
      this.log('DEBUG', message, data);
    }
  }
}

export default new Logger();
