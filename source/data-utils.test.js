import assert from 'assert';
import { makeSwishData } from './data-utils.js';

describe('makeSwishData', function () {
  it('should create a swish data object', function () {
    const amount = '100';
    const message = 'Test message';
    const result = makeSwishData(amount, message);
    assert.strictEqual(result.format, 'png');
    assert.deepStrictEqual(result.payee, {
      value: '1231181189',
      editable: false,
    });
    assert.deepStrictEqual(result.amount, { value: amount, editable: false });
    assert.deepStrictEqual(result.message, { value: message, editable: false });
    assert.strictEqual(result.size, 300);
    assert.strictEqual(result.border, 2);
    assert.strictEqual(result.transparent, false);
  });
});
