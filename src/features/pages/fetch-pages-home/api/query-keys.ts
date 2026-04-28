/**
 * Query keys factory for pages-home feature.
 */
export const pagesHomeKeys = {
  all: ['pages-home'] as const,
  lists: () => [...pagesHomeKeys.all, 'list'] as const,
};