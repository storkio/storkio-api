import request from 'supertest';
import {initServer} from '../../server.util';

let compressionError = null;
const mockCompression = jest.fn(() => (req, res, next) => next(compressionError));
const mockInfo = jest.fn();
const mockError = jest.fn();

jest.mock('compression', () => mockCompression);
jest.mock('env-bunyan', () => ({
  info: mockInfo,
  error: mockError
}));


describe('Express routes', () => {
  const {started, close, server} = initServer('routes');

  beforeAll(() => started);

  afterAll(close);

  describe('GET /bla', () => {
    it('should fail for missing address', () => request(server)
      .get('/bla')
      .expect(404));
  });

  describe('handle errors', () => {
    beforeAll(() => {
      compressionError = new Error('bad');
    });

    afterAll(() => {
      compressionError = null;
    });

    it('should log internal errors', () => request(server)
      .get('/error')
      .expect(500)
      .then(({body}) => {
        expect(body).toHaveProperty('message', 'Internal Server Error');
        expect(mockError).toHaveBeenCalled();
      }));
  });
});