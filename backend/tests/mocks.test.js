// Test to verify mocks are working
const winston = require('winston');
const fs = require('fs');

describe('Mock Verification', () => {
  test('winston mock should work', () => {
    expect(winston.createLogger).toBeDefined();
    expect(winston.format.combine).toBeDefined();
    expect(winston.format.errors).toBeDefined();
    
    const logger = winston.createLogger();
    expect(logger.add).toBeDefined();
    expect(logger.info).toBeDefined();
  });

  test('fs mock should work', () => {
    expect(fs.existsSync).toBeDefined();
    expect(fs.mkdirSync).toBeDefined();
  });
});
