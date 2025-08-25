interface ApiError {
  response?: {
    status?: number;
    data?: { errors?: Array<{ msg: string }> };
  };
  message?: string;
}

export function handleApiError(error: unknown, context: string) {
  const err = error as ApiError;

  if (err.response?.status === 401) {
    console.error(
      'Authentication failed. Please check your SONAR_TOKEN environment variable.'
    );
  } else if (err.response?.status === 403) {
    console.error(
      'Access denied. You may not have permission to access this resource.'
    );
  } else if (err.response?.status === 404) {
    console.error('Resource not found.');
  } else if (err.response?.data?.errors) {
    console.error(
      'API Error:',
      err.response.data.errors.map((e) => e.msg).join(', ')
    );
  } else {
    console.error(`Error ${context}:`, err.message || 'Unknown error');
  }

  process.exit(1);
}
