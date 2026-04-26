export const makeSwishData = (amount, message) => {
  return {
    format: 'png',
    payee: {
      value: '1231181189', // Example payee number, replace with actual if needed
      editable: false,
    },
    amount: {
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
