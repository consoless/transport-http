import fn from './index';

test('title', () => {
  expect(fn('es-next')).toBe(undefined);
});
