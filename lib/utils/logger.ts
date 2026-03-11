type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private formatLog(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }
  }

  info(message: string, data?: any): void {
    const log = this.formatLog('info', message, data)
    console.log(`[INFO] ${log.timestamp} - ${message}`, data ? data : '')
  }

  warn(message: string, data?: any): void {
    const log = this.formatLog('warn', message, data)
    console.warn(`[WARN] ${log.timestamp} - ${message}`, data ? data : '')
  }

  error(message: string, error?: any): void {
    const log = this.formatLog('error', message, error)
    console.error(`[ERROR] ${log.timestamp} - ${message}`, error ? error : '')
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      const log = this.formatLog('debug', message, data)
      console.debug(`[DEBUG] ${log.timestamp} - ${message}`, data ? data : '')
    }
  }

  apiRequest(method: string, url: string, statusCode?: number): void {
    this.info(`API Request: ${method} ${url}`, { statusCode })
  }

  apiError(method: string, url: string, error: any): void {
    this.error(`API Error: ${method} ${url}`, error)
  }

  authEvent(event: string, userId?: string): void {
    this.info(`Auth Event: ${event}`, { userId })
  }
}

export const logger = new Logger()
