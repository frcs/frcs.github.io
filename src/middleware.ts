import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Case-insensitive routing: redirect any uppercase route to its lowercase equivalent
  if (
    pathname !== pathname.toLowerCase() &&
    !pathname.startsWith('/@') &&
    !pathname.startsWith('/_astro') &&
    !pathname.startsWith('/_image') &&
    !pathname.startsWith('/src') &&
    !pathname.startsWith('/node_modules') &&
    !pathname.includes('.')
  ) {
    return context.redirect(pathname.toLowerCase() + url.search + url.hash, 301);
  }

  return next();
});
