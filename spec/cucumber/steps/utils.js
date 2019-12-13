function getValidPayload(type) {
  const lowercaseType = type.toLowerCase();
  switch (lowercaseType) {
    case 'create user':
      return {
        email: 'test@email.com',
        password: 'pasSword#67',
      };

    default:
      return undefined;
  }
}

function convertStringToArray(string) {
  return string.split(',')
    .map((value) => value.trim())
    .filter((value) => value !== '');
}

export { getValidPayload, convertStringToArray };
