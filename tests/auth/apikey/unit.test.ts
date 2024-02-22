import { API_KEY } from './mock'; // mock should be imported on the top
import app from '../../../src/app';
import supertest from 'supertest';

describe('apikey validation', () => {
  const endpoint = '/tokens';
  const request = supertest(app);

  it('Should response with 400 if x-api-key header is not passed', async () => {
    const response = await request.get(endpoint).timeout(2000);
    expect(response.status).toBe(400);
  });

  it('Should response with 403 if wrong x-api-key header is passed', async () => {
    const wrongApiKey = '123';
    const response = await request
      .get(endpoint)
      .set('x-api-key', wrongApiKey)
      .timeout(2000);
    expect(response.status).toBe(403);
  });

  it('Should respond with 200 if the correct x-api-key header is passed', async () => {
    const response = await request
      .get(endpoint)
      .set('x-api-key', API_KEY)
      .timeout(2000);
    expect(response.status).toBe(200);
  });
});
