const offset = 'shm_hijack_';

const PropertyOffset = (key) => `${offset}${key}`;

export const sizeKey = PropertyOffset('size');
export const reuseIdentifierKey = PropertyOffset('reuseIdentifier');
export const instanceIdentityKey = PropertyOffset('instanceIdentity');

export default PropertyOffset;