import {isSet, isMap} from 'node:util/types';

export enum FreezeRecursionBehavior {
  Throw = 'Throw',              // If encountering a cyclical object anywhere, throw an exception
  Ignore = 'Ignore',            // If encountering a cyclical object anywhere act as if it does not exist
}

/**C
 * Deep freeze an object recursively.  Be careful for cyclical objects or an infinite loop will be created.
 * This method attempts to avoid a cyclical issue.  We say "attempts" as it covers objects in general as well as currently
 * known collections
 *
 *
 * Object's enumerable properties are recursed into
 *
 * If a property is an Array, Map, or Set, their elements are recursed into (but not keys for Maps)
 *
 * Frozen objects will not be frozen again, nor will they be recursed into.
 *
 * @param object The object to deep freeze
 * @param ec Execution context
 * @param cyclicalBehavior If cyclical behavior is Ignore, then does nothing to the referential duplicate
 * @param references All the parent objects, which will be frozen before this object.  If not provided, a fresh start is tone (for example for the first deepFreeze call
 */
export function deepFreeze(object: Object, cyclicalBehavior = FreezeRecursionBehavior.Throw, references: Set<any> = new Set()): Object {

  if (!object || Object.isFrozen(object)) {
    return object;
  }
  if (references.has(object)) {
    if (cyclicalBehavior === FreezeRecursionBehavior.Throw) {
      throw new Error(`Cyclical reference encountered on object`);
    } else {
      return object;
    }
  }
  // Always remember the parent of its properties as being needed to be frozen
  references.add(object);
  // This object could itself be a collection
  if (Array.isArray(object) || isSet(object) || isMap(object)) {
    // For each functionality overlaps for these three types, since for Map the first parameter is the value
    object.forEach(element => deepFreeze(element, cyclicalBehavior, references));
  }
  // Iterate over object properties to deep freeze objects
  const propNames: string[] = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const property = object[name];
    if (property && typeof property === 'object') {
      // If property is a collection, need to deep freeze
      if (Array.isArray(property) || isSet(property) || isMap(property)) {
        // For each functionality overlaps for these three types, since for Map the first parameter is the property
        property.forEach(element => deepFreeze(element, cyclicalBehavior, references));
      }
      // Deep freeze the property itself
      deepFreeze(property, cyclicalBehavior, references);
    }
  }
  // All child objects or collection objects have been frozen.  Now freeze "this" object
  return Object.freeze(object);
}

export default deepFreeze;
