import { z } from 'zod'

// Environment schema validation
const envSchema = z.object({
  // App Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  
  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5000/api'),
  API_TIMEOUT: z.string().transform(Number).default('30000'),
  
  // Authentication
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  
  // Database
  DATABASE_URL: z.string().min(1),
  
  // External Services
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Email Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  
  // N8N Configuration
  N8N_WEBHOOK_URL: z.string().url().optional(),
  N8N_API_KEY: z.string().optional(),
  
  // Analytics
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  
  // Feature Flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.string().transform(Boolean).default('false'),
  NEXT_PUBLIC_ENABLE_EMAIL_INTEGRATION: z.string().transform(Boolean).default('true'),
})

// Parse and validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'))
      throw new Error(
        `❌ Invalid environment variables: ${missingVars.join(', ')}\n` +
        '💡 Tip: Make sure you have a .env.local file with the required variables.'
      )
    }
    throw error
  }
}

// Export validated environment
export const env = parseEnv()

// Type-safe environment access
export type Env = z.infer<typeof envSchema>

// Environment helpers
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Feature flags
export const features = {
  analytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS,
  emailIntegration: env.NEXT_PUBLIC_ENABLE_EMAIL_INTEGRATION,
} as const 