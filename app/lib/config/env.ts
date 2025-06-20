// Environment configuration utilities
export interface AppConfig {
  // Database
  databaseUrl: string;
  
  // Session
  sessionSecret: string;
  
  // Application
  nodeEnv: string;
  port: number;
  
  // Security
  bcryptRounds: number;
  
  // File Upload
  maxFileSize: number;
  uploadDir: string;
  
  // MCP Server
  mcpServerPort: number;
  mcpServerHost: string;
  
  // API
  apiRateLimit: number;
  apiCorsOrigin: string;
  
  // Logging
  logLevel: string;
  logFile: string;
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value;
}

function getEnvNumber(name: string, defaultValue?: number): number {
  const value = process.env[name];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number, got: ${value}`);
  }
  return parsed;
}

export const config: AppConfig = {
  // Database
  databaseUrl: getEnvVar("DATABASE_URL", "file:./app/lib/db/sqlite.db"),
  
  // Session
  sessionSecret: getEnvVar("SESSION_SECRET", "dev-secret-change-in-production"),
  
  // Application
  nodeEnv: getEnvVar("NODE_ENV", "development"),
  port: getEnvNumber("PORT", 5173),
  
  // Security
  bcryptRounds: getEnvNumber("BCRYPT_ROUNDS", 12),
  
  // File Upload
  maxFileSize: getEnvNumber("MAX_FILE_SIZE", 5242880), // 5MB
  uploadDir: getEnvVar("UPLOAD_DIR", "./uploads"),
  
  // MCP Server
  mcpServerPort: getEnvNumber("MCP_SERVER_PORT", 3001),
  mcpServerHost: getEnvVar("MCP_SERVER_HOST", "localhost"),
  
  // API
  apiRateLimit: getEnvNumber("API_RATE_LIMIT", 100),
  apiCorsOrigin: getEnvVar("API_CORS_ORIGIN", "*"),
  
  // Logging
  logLevel: getEnvVar("LOG_LEVEL", "info"),
  logFile: getEnvVar("LOG_FILE", "./logs/app.log")
};

// Validation function to check config on startup
export function validateConfig(): void {
  // Check critical settings
  if (config.nodeEnv === "production" && config.sessionSecret === "dev-secret-change-in-production") {
    throw new Error("SESSION_SECRET must be changed in production!");
  }
  
  if (config.bcryptRounds < 10) {
    console.warn("Warning: BCRYPT_ROUNDS is less than 10, consider increasing for better security");
  }
  
  if (config.maxFileSize > 100 * 1024 * 1024) { // 100MB
    console.warn("Warning: MAX_FILE_SIZE is very large, this may cause performance issues");
  }
}

// Helper functions
export const isDevelopment = () => config.nodeEnv === "development";
export const isProduction = () => config.nodeEnv === "production";
export const isTest = () => config.nodeEnv === "test";