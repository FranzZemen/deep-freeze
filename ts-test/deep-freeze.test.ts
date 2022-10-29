import 'mocha';
import * as chai from 'chai';
import deepFreeze from '../publish/index.js';

const expect = chai.expect;
const should = chai.should();

describe('deep-freeze tests', () => {
  it('should freeze empty object', () => {
    Object.isFrozen(deepFreeze({})).should.be.true;
  })
  it('should freeze simple object', () => {
    Object.isFrozen(deepFreeze({a:1, b:2})).should.be.true;
  })
  it('should freeze nested object', () => {
    const b = {b:1};
    const a = {b: b, c: 2};
    deepFreeze(a);
    Object.isFrozen(a).should.be.true;
    Object.isFrozen(b).should.be.true;
  })
  it('should freeze array', () => {
    const a = [1, 2, 3];
    deepFreeze(a);
    Object.isFrozen(a).should.be.true;
  })
  it('should freeze array with objects', () => {
    const a = [1, {b:1}, 3];
    deepFreeze(a);
    Object.isFrozen(a).should.be.true;
    Object.isFrozen(a[1]).should.be.true;
  })
  it('should freeze set', () => {
    const a = new Set();
    a.add({b:1})
    deepFreeze(a);
    Object.isFrozen(a).should.be.true;
    a.forEach(item => {
      Object.isFrozen(item).should.be.true;
    })
  })
  it('should freeze map', () => {
    const a = new Map();
    const b = {b:1};
    const c = {c:1};
    a.set(b, c);
    deepFreeze(a);
    Object.isFrozen(a).should.be.true;
    a.forEach(item => {
      Object.isFrozen(item).should.be.true;
    })
    Object.isFrozen(a.keys().next()).should.be.false;
  })
})
