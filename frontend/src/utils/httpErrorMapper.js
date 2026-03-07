const FALLBACK_HTTP_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

export function mapHttpError(error) {
  const apiMessage = error?.response?.data?.error?.message || error?.response?.data?.message;

  if (typeof apiMessage === 'string' && apiMessage.trim()) {
    return apiMessage.trim();
  }

  if (typeof error?.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  return FALLBACK_HTTP_ERROR_MESSAGE;
}
