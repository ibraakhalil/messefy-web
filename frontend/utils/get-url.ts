import { env } from '@/config/env';

export function getUrl(path: string) {
  const isDev = env.NODE_ENV === 'development';
  const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;
  const protocol = isDev ? 'http://' : 'https://';

  return `${protocol}${rootDomain}${path}`;
}
