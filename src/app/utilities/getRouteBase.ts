export const getRouteBase = (url: string): string => url.match(/(.*?)(;|$)/)[1];
