/**
 * Tests unitaires de la logique pure du mobile (utilitaires).
 * Le rendu des composants React Native n'est pas testé ici (nécessiterait
 * jest-expo) ; on cible la logique métier isolée dans src/utils.
 */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/utils'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: { esModuleInterop: true, strict: true } }],
  },
};
