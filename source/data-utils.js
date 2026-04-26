export const makeSwishData = (amount, message) => {
  return {
    format: 'png',
    payee: {
      value: amount,
      editable: false,
    },
    message: {
      value: message,
      editable: false,
    },
    size: 300,
    border: 2,
    transparent: false,
  };
};
