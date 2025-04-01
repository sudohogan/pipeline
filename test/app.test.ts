import { createServer } from "http";
import express from "express";
import moment from "moment";

// Mock the dependencies
jest.mock("http", () => ({
  createServer: jest.fn().mockReturnValue({
    listen: jest.fn((port, callback) => callback()),
  }),
}));

jest.mock("express", () => {
  const mockExpress = () => ({
    use: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
  });
  // Attach static properties (like express.json())
  mockExpress.json = jest.fn();
  return mockExpress;
});

jest.mock("moment", () => ({
  now: jest.fn(() => 123456789),
}));

describe("Server", () => {
  let originalConsoleLog: any;

  beforeAll(() => {
    originalConsoleLog = console.log;
    console.log = jest.fn(); // Mock console.log
    require("../src/app"); // Import the server file
  });

  afterAll(() => {
    console.log = originalConsoleLog; // Restore console.log
    jest.resetAllMocks();
  });

  it("should start the server on port 3005", () => {
    expect(createServer).toHaveBeenCalled();
    expect(createServer().listen).toHaveBeenCalledWith(
      3005,
      expect.any(Function)
    );
  });

  it("should log the correct time message", () => {
    expect(console.log).toHaveBeenCalledWith("The time is 123456789");
  });
});
