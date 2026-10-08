export const duration = (seconds: number): string =>
  seconds === 60 ? '60 seconds (local demo)' : seconds / 60 + ' minutes'
