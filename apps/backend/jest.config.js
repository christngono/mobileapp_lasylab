/** Configuration Jest (tests unitaires backend). */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  moduleNameMapper: {
    // Résout les types/valeurs partagés sans exiger un build préalable.
    '^@lasylab/shared$': '<rootDir>/../../../packages/shared/src',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/../tsconfig.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
};
