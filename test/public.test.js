const assert = require('assert');
const request = require('request-promise');

describe('Feathers application tests', () => {
  it('starts and shows the index page', () => {
    return request(getUrl()).then(body =>
      assert.ok(body.indexOf('<html>') !== -1)
    );
  });

  describe('404', function () {
    it('shows a 404 HTML page', () => {
      return request({
        url: getUrl('path/to/nowhere'),
        headers: {
          'Accept': 'text/html'
        }
      }).catch(res => {
        assert.equal(res.statusCode, 404);
        assert.ok(res.error.indexOf('<html>') !== -1);
      });
    });

    it('shows a 404 JSON error without stack trace', () => {
      return request({
        url: getUrl('path/to/nowhere'),
        json: true
      }).catch(res => {
        assert.equal(res.statusCode, 404);
        assert.equal(res.error.code, 404);
        assert.equal(res.error.message, 'Page not found');
        assert.equal(res.error.name, 'NotFound');
      });
    });
  });
});
