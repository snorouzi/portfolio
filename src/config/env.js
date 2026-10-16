const required = (key) => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Copy .env.example to .env.local and fill in the value, then restart the development server.`
    );
  }

  return value;
};

const appUrl = required('VITE_APP_URL');

try {
  new URL(appUrl);
} catch {
  throw new Error(`Invalid environment variable VITE_APP_URL: "${appUrl}" must be a valid URL.`);
}

export const env = {
  appName: required('VITE_APP_NAME'),
  appUrl,
};

export default env;
