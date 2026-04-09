function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableGeminiError(error) {
  const status = error?.status;
  const message = error?.message || "";

  return (
    status === 503 ||
    status === 500 ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand") ||
    message.includes("overloaded")
  );
}

async function withGeminiRetry(fn, options = {}) {
  const {
    retries = 3,
    baseDelayMs = 1200,
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;

      if (!isRetryableGeminiError(error) || attempt === retries) {
        throw error;
      }

      const delay = baseDelayMs * Math.pow(2, attempt);
      await sleep(delay);
    }
  }

  throw lastError;
}

module.exports = withGeminiRetry;