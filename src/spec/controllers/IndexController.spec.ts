import chai, {app} from '../spec_helper';

describe('index', () => {
  describe('GET /', () => {
    it('returns 200 for successful connect', async () => {
      const res = await chai.request(app).get('/');
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.success.should.equal(true);
    });
  });
});
