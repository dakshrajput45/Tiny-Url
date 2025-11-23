/**
 * Generic retry utility function for async operations
 * Attempts to execute a function multiple times until it succeeds or max retries is reached
 * 
 * @param fn - The async function to retry
 * @param maxRetries - Maximum number of attempts (default: 3)
 * @param delayMs - Delay in milliseconds between retries (default: 0, no delay)
 * @returns The result of the successful function execution
 * @throws Error if all retry attempts fail
 */
export const retryAsync = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 0
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1 && delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} retries: ${lastError?.message || lastError}`);
};