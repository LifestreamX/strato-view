import { logger } from '@/lib/utils/logger'

describe('Logger', () => {
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation()
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should log info messages', () => {
    logger.info('test message')
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should log with data', () => {
    logger.info('test message', { key: 'value' })
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should log warnings', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation()
    logger.warn('warning message')
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('should log errors', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    logger.error('error message')
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('should log API requests', () => {
    logger.apiRequest('GET', '/api/test', 200)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should log API errors', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation()
    logger.apiError('GET', '/api/test', new Error('test error'))
    expect(errorSpy).toHaveBeenCalled()
    errorSpy.mockRestore()
  })

  it('should log auth events', () => {
    logger.authEvent('sign_in', 'user123')
    expect(consoleSpy).toHaveBeenCalled()
  })
})
