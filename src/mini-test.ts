export function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`${actual} no es igual a ${expected}`);
      }
    },
  };
}

export async function test(title: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    console.log(`✔ ${title}`);
  } catch (error) {
    console.error(`✖ ${title}`);
    console.error(error);
    process.exitCode = 1;
  }
}
