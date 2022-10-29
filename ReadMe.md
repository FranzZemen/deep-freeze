# Read Me
Implements a recursive "deep freeze" using Object.freeze.  Default behavior is to throw on cyclical children, but 
can also be set to ignore.

# Install

npm i @franzzemen/deep-freeze

# Usage

This package is published for an ECMAScript module loader.  For CommonJS see below.

### ECMAScript

    import {deepFreeze} from '@franzzemen/deep-freeze';
    const object = {};
    deepFreeze(object);

## CommonJS

    import('@franzzemen/deep-freeze')
        .then(package => {
            const object = {};
            package.deepFreeze(object);
        }

