import assert from 'assert';
import { makeSwishData } from './data-utils.js';

describe('makeSwishData', function () {
  it('should create a swish data object', function () {
    const result = makeSwishData('100', 'Test message');
    assert.strictEqual(result.format, 'png');
    assert.strictEqual(result.payee.value, '100');
    assert.strictEqual(result.message.value, 'Test message');
    assert.strictEqual(result.size, 300);
    assert.strictEqual(result.border, 2);
    assert.strictEqual(result.transparent, false);
  });
});
