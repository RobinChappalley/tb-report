import { pathOr } from 'ramda';

/**
 * Return path value or empty object
 * Useful for destructured variables
 *
 * @param {string} path
 * @param {Object} obj
 * @param def
 */
const SafePath = (path, obj, def = {}) => pathOr(def, path.split('.'), obj);
export default SafePath;
