import dotenv from 'dotenv';

export type Environment = {
  baseURL: string;
  apiURL: string;
  credentials?: {
    username: string;
    password: string;
  };
};

export type EnvironmentConfig = {
  [key: string]: Environment;
};

// Load environment variables from .env file
dotenv.config();

const config: EnvironmentConfig = {
  development: {
    baseURL: 'http://localhost:3000',
    apiURL: 'http://localhost:3000/api',
    credentials: {
      username: 'test-user',
      password: 'test-password'
    }
  },
  staging: {
    baseURL: process.env.STAGING_URL || 'https://staging.example.com',
    apiURL: process.env.STAGING_API_URL || 'https://staging.example.com/api',
    credentials: {
      username: process.env.STAGING_USERNAME || 'staging-user',
      password: process.env.STAGING_PASSWORD || 'staging-password'
    }
  },
  production: {
    baseURL: process.env.PROD_URL || 'https://example.com',
    apiURL: process.env.PROD_API_URL || 'https://example.com/api'
    // No default credentials for production
  }
};

async function globalSetup() {
  // Set environment-specific configuration
  const env = process.env.TEST_ENV || 'development';
  process.env.BASE_URL = config[env].baseURL;
  process.env.API_URL = config[env].apiURL;
  
  if (config[env].credentials) {
    process.env.TEST_USERNAME = config[env].credentials.username;
    process.env.TEST_PASSWORD = config[env].credentials.password;
  }
}

export default globalSetup;