export function updateSet<T>(
    set: Set<T>,
    updater: (copy: Set<T>) => void
): Set<T> {
    const copy = new Set(set);
    updater(copy);
    return copy;
}

export function getImage(tag: string) {
  return new URL(`./assets/${tag}`, import.meta.url).href;
}