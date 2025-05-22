import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import { setupTestDatabase, teardownTestDatabase } from './setup.js';

describe('Components API', () => {
  before(async () => {
    await setupTestDatabase();
  });

  after(async () => {
    await teardownTestDatabase();
  });

  describe('GET /api/components', () => {
    it('should return a list of components', async () => {
      const response = await request(app)
        .get('/api/components')
        .expect('Content-Type', /json/)
        .expect(200);

      console.log('Response body:', response.body);
      
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0);
      
      // Check structure of first component
      const firstComponent = response.body[0];
      expect(firstComponent).to.have.property('componentType');
      expect(firstComponent).to.have.property('displayName');
      expect(firstComponent).to.have.property('description');
      expect(firstComponent).to.have.property('defaultProps');
    });
  });
}); 