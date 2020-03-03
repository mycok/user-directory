import objectPath from 'object-path';

function getValidPayload(type, context = {}) {
  const lowercaseType = type.toLowerCase();
  switch (lowercaseType) {
    case 'create user':
    case 'login':
      return {
        email: 'test@email.com' || context.email,
        password: 'paSSword#45' || context.password,
      };
    case 'update user profile':
      return {
        name: {
          first: 'Michael',
          middle: 'Myckie',
          last: 'Myco',
        },
        bio: 'bio',
        summary: 'summary',
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

function substitutePath(context, path) {
  // split the path into parts
  return path.split('/').map((part) => {
    // if the path starts with a colon (:),
    // perform a substitution with the value of the context property with the same name
    if (part.startsWith(':')) {
      const contextPath = part.substr(1);
      return objectPath.get(context, contextPath);
    }
    return part;
  }).join('/');
}

function processPath(context, path) {
  // if the path doesn't contain a colon, then leave it unchanged
  if (!path.includes(':')) {
    return path;
  }
  return substitutePath(context, path);
}

export {
  getValidPayload, convertStringToArray, processPath,
};
