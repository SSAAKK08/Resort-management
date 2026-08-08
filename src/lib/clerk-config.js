const placeholderPattern = /(replace|your[_-]?real|your[_-]?key|example|placeholder)/i;

function isUsableKey(value, prefix) {
  return typeof value === 'string'
    && value.startsWith(prefix)
    && value.length >= 30
    && !placeholderPattern.test(value);
}

export function hasClerkPublishableKey(value = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '') {
  return isUsableKey(value.trim(), 'pk_');
}

export function hasClerkSecretKey(value = process.env.CLERK_SECRET_KEY || '') {
  return isUsableKey(value.trim(), 'sk_');
}

