interface ApiError {
  message?: string;
  details?: Record<string, string[]>;
  status_code?: number;
  [key: string]: any;
}

export function handleApiError(error: any): string {
  // If error has a response with data
  if (error.response?.data) {
    const data = error.response.data;

    // Handle DRF validation errors format
    if (data.details) {
      const fieldErrors: string[] = [];

      for (const [field, messages] of Object.entries(data.details)) {
        if (Array.isArray(messages)) {
          const fieldName = formatFieldName(field);
          messages.forEach((msg: string) => {
            fieldErrors.push(`${fieldName}: ${msg}`);
          });
        }
      }

      if (fieldErrors.length > 0) {
        return fieldErrors.join('\n');
      }
    }

    // Handle nested error format: { error: { details: {...} } }
    if (data.error?.details) {
      const fieldErrors: string[] = [];

      for (const [field, messages] of Object.entries(data.error.details)) {
        if (Array.isArray(messages)) {
          const fieldName = formatFieldName(field);
          messages.forEach((msg: string) => {
            fieldErrors.push(`${fieldName}: ${msg}`);
          });
        }
      }

      if (fieldErrors.length > 0) {
        return fieldErrors.join('\n');
      }
    }

    // Handle simple message format
    if (data.message) {
      return data.message;
    }

    // Handle nested error message format
    if (data.error?.message) {
      return data.error.message;
    }

    // Handle non-field errors
    if (data.non_field_errors) {
      if (Array.isArray(data.non_field_errors)) {
        return data.non_field_errors.join('\n');
      }
      return String(data.non_field_errors);
    }

    // Handle error as string
    if (typeof data === 'string') {
      return data;
    }
  }

  // Handle network errors
  if (error.message) {
    if (error.message.includes('Network Error')) {
      return 'Network error. Please check your internet connection and try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timeout. Please try again.';
    }
    return error.message;
  }

  // Default error message
  return 'An unexpected error occurred. Please try again.';
}

function formatFieldName(field: string): string {
  // Convert snake_case to Title Case
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getFieldErrors(error: any): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  if (error.response?.data?.details) {
    for (const [field, messages] of Object.entries(error.response.data.details)) {
      if (Array.isArray(messages) && messages.length > 0) {
        fieldErrors[field] = messages[0];
      }
    }
  }

  return fieldErrors;
}
