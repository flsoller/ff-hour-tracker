// Helper function to flush promises in component tests with async store functions
export const flushPromises = () =>
  new Promise((resolve) => setTimeout(resolve, 200));
