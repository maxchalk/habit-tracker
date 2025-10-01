// Mock Winston logger for tests
const winston = {
  createLogger: jest.fn(() => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    log: jest.fn(),
    add: jest.fn(), // This was missing!
    remove: jest.fn(),
    clear: jest.fn(),
    level: 'info'
  })),
  format: {
    combine: jest.fn(() => ({})),
    timestamp: jest.fn(() => ({})),
    errors: jest.fn(() => ({})),
    json: jest.fn(() => ({})),
    printf: jest.fn(() => ({})),
    colorize: jest.fn(() => ({})),
    simple: jest.fn(() => ({}))
  },
  transports: {
    Console: jest.fn().mockImplementation(() => ({})),
    File: jest.fn().mockImplementation(() => ({}))
  }
};

module.exports = winston;
