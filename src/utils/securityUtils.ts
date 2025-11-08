/**
 * Security Utilities
 * XSS prevention and input sanitization
 */

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Sanitize user input (remove potentially dangerous characters)
 */
export function sanitizeInput(input: string): string {
  // Remove script tags
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  return sanitized.trim();
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string {
  // Remove javascript: and data: protocols
  const sanitized = url.replace(/^(javascript|data):/gi, '');

  // Ensure http or https protocol
  if (!sanitized.match(/^https?:\/\//i)) {
    return '';
  }

  return sanitized;
}

/**
 * Generate random string (for CSRF tokens, etc.)
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Mask sensitive data (e.g., credit card, phone)
 */
export function maskSensitiveData(data: string, visibleChars = 4): string {
  if (data.length <= visibleChars) return data;

  const masked = '*'.repeat(data.length - visibleChars);
  return masked + data.slice(-visibleChars);
}

/**
 * Check if string contains HTML
 */
export function containsHtml(text: string): boolean {
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  return htmlRegex.test(text);
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

