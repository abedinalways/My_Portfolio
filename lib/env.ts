/**
 * Centralized Environment Configuration
 * Provides typed, validated access to environment variables across the application.
 */

export const env = {
  // Upstash Redis Configuration
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",

  // Google Gemini API Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",

  // Helper flags
  get isUpstashConfigured(): boolean {
    return Boolean(this.UPSTASH_REDIS_REST_URL && this.UPSTASH_REDIS_REST_TOKEN);
  },

  get isGeminiConfigured(): boolean {
    return Boolean(this.GEMINI_API_KEY);
  },
} as const;

export default env;
