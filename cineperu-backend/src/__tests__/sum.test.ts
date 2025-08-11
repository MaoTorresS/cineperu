// test de ejemplo para Jest en el backend
// Archivo: src/__tests__/sum.test.ts
// Este test valida que la función suma funcione correctamente

function sum(a: number, b: number): number {
  return a + b;
}

describe('sum', () => {
  it('debe sumar dos números correctamente', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
