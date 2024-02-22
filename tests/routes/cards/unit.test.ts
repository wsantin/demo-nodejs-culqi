import supertest from 'supertest';
import { API_KEY } from '../../auth/apikey/mock'
import app from '../../../src/app';

describe('Tokens', () => {
  const endpoint = '/tokens';
  const request = supertest(app);

  it('You must respond with 400 if body does not comply with the rule', async () => {

    const payload = {
      card_number: "4556737586899855",
      cvv: "123",
      expiration_month: "02234234",
      expiration_year: "2024234234",
      email: "examplegmail.com"
    }
    
    const response = await request
      .post(endpoint)
      .set('Content-Type', 'application/json')
      .set('x-api-key', API_KEY)
      .send(payload)
      .timeout(2000);
      
    expect(response.status).toBe(400);
  });

});
