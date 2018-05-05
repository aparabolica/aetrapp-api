const should = require('should');

const fakeBase64Image = 'data:image/jpeg;base64,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';

describe('Samples service', () => {

  describe('Sample creation', function () {
    // When a sample is sent, trap status is changed to 'analysing-sample'

    // When analysis is finished:
    // - if sample is valid, change status to 'finished'
    // - if sample is invalid, change status to 'invalid-sample'
    // - if seven days has passed, mark sample as delayed

    let trapId;

    it('Create a testing trap', done => {
      const trapService = global.loggedRegularUser1.service('traps');
      trapService.create({
        addressStreet: 'Avenida Paulista, 212',
        cityId: '3513801',
        base64: fakeBase64Image,
        coordinates: {
          type: "Point",
          coordinates: [-46.6547, -23.5639],
          crs: {
            type: "name",
            properties: {
              name: "EPSG:4326"
            }
          }
        }
      })
        .then(trap => {
          if (trap && typeof trap.id == 'string') {
            trapId = trap.id;
            done();
          }
          else done(new Error('Invalid trap creation.'));
        })
        .catch(err => { done(err); });
    });

    it('After creating a sample, trap status should be "analysing"', done => {
      const trapService = global.loggedRegularUser1.service('traps');
      const sampleService = global.loggedRegularUser1.service('samples');
      sampleService.create({
        base64: fakeBase64Image,
        collectedAt: Date.now(),
        trapId
      })
        .then(async sample => {
          if (sample && typeof sample.id == 'string') {
            const trap = await trapService.get(trapId);
            trap.should.have.property('status', 'analysing');
            done();
          }
          else done(new Error('Invalid sample creation.'));
        })
        .catch(err => { done(err); });

    });

  });
});
