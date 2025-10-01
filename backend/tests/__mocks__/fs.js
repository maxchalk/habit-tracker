// Mock fs module for tests
const fs = {
  existsSync: jest.fn(() => true), // Always return true to avoid directory creation
  mkdirSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  appendFileSync: jest.fn()
};

module.exports = fs;
