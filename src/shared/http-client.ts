import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { logger } from './logger';

/**
 * HTTP client configuration.
 * All providers share the same settings, no per-provider overrides.
 */
const HTTP_TIMEOUT = 30000;    // 30 seconds
const HTTP_RETRIES = 2;        // 2 retries (3 total attempts)
const RETRY_DELAY_BASE = 1000; // 1 second base delay (exponential backoff)

/**
 * HTTP client wrapper with retry logic and error handling.
 * Exported as a singleton, all providers use this same instance.
 */
class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: HTTP_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
  }

  /**
   * GET request with automatic retry on failure.
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>('GET', url, config);
  }

  /**
   * POST request with automatic retry on failure.
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>('POST', url, { ...config, data });
  }

  /**
   * Execute request with exponential backoff retry.
   *
   * Retry behavior:
   * - Attempt 1: immediate
   * - Attempt 2: wait 1s (1000 * 2^0)
   * - Attempt 3: wait 2s (1000 * 2^1)
   *
   * Does NOT retry on 4xx errors (client errors) - only on 5xx and network errors.
   */
  private async requestWithRetry<T>(
    method: string,
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const maxAttempts = HTTP_RETRIES + 1; // retries + initial attempt
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.client.request<T>({
          method,
          url,
          ...config,
        });
        return response.data;
      } catch (error) {
        lastError = error as Error;
        const axiosError = error as AxiosError;

        // Don't retry on 4xx errors (client errors)
        if (axiosError.response && axiosError.response.status >= 400 && axiosError.response.status < 500) {
          throw error;
        }

        if (attempt < maxAttempts) {
          const delay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1);
          logger.warn(`Request failed, retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`, {
            url,
            error: axiosError.message,
          });
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Singleton HTTP client instance.
 * All provider factories import and use this same instance.
 */
export const httpClient = new HttpClient();
