const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Validator function for required string input fields
 * @param input - String input value
 */
function validateInputString(input: string): {
  valid: boolean;
  message: string | null;
} {
  if ((input || '').trim().length === 0) {
    return { valid: false, message: 'Input Required' };
  }

  return { valid: true, message: null };
}

/**
 * Validator function for email form field
 * @param email - Email string
 */
function validateEmail(email: string): {
  valid: boolean;
  message: string | null;
} {
  if (!email.toLowerCase().match(emailRegex)) {
    return { valid: false, message: 'Invalid Email' };
  }

  return { valid: true, message: null };
}

export { validateEmail, validateInputString };
