import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Only initialize Sentry if the environment is 'production'
  if (process.env.SENTRY_ENVIRONMENT === 'production') {
    // Check the runtime and load the appropriate config
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      await import('./sentry.server.config');
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
      await import('./sentry.edge.config');
    }
  } else {
    console.log("Sentry is disabled in this environment.");
  }
}

// Capture request errors only in production
export const onRequestError =
  process.env.SENTRY_ENVIRONMENT === 'production'
    ? Sentry.captureRequestError
    : null;
