/**
 * sanitize() do user inputs before save it into database
 * @param {String} string
 * @return {String} value
 */
export const sanitize = (string) => {
  let value = string.replace(/[*?^${}<>`();[]|[\]\\]/g, ' ');
  return value.trim();
};

/**
 * capitalize() capitalize first letter
 * @param {String} string
 * @return {String} value
 */
export const capitalize = (string) => {
  if (string) {
    let value = string.charAt(0).toUpperCase() + string.slice(1);
    return value.trim();
  } else {
    return '';
  }
};

/**
 * decodeJwt() decode JWT Token from base64 to JSON object
 * @param {String} token
 * @return {Object} JSON
 */
export const decodeJwt = (token) => {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  let jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
  return JSON.parse(jsonPayload);
};

/**
 * isEmpty() check if object is empty
 * @param {String} obj
 * @return {Boolean}
 */
export const isEmpty = (obj) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

/**
 * randomHash() create random string with chars and numbers
 * @param {Number, String} len || charSet
 * @return {String} randomString
 */
export const randomHash = (len, charSet) => {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};
