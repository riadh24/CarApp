module.exports = {
  Platform: {
    OS: 'ios',
    select: (obj) => obj.ios || obj.default,
  },
  UnavailabilityError: class UnavailabilityError extends Error {
    constructor(moduleName, propertyName) {
      super(`${moduleName}.${propertyName} is not available`);
      this.name = 'UnavailabilityError';
    }
  },
};
