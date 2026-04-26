import assert from 'assert';
import { get_png_from_api } from './source/api.js';
import sinon from 'sinon';
import axios from 'axios';

describe('get_png_from_api', function () {
  it('should return data from the API (mocked)', async function () {
    const fakeData = Buffer.from([1, 2, 3, 4]);
    const postStub = sinon.stub(axios, 'post').resolves({ data: fakeData });
    const url = 'https://example.com/api';
    const payload = { foo: 'bar' };
    const result = await get_png_from_api(url, payload);
    assert.deepStrictEqual(result, fakeData);
    postStub.restore();
  });
});
