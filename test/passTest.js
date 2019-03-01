'use strict';

process.env.LOG_LEVEL = 'fatal';
const PasswordScoringLib = require('../lib/passwordScoringLib');
const chai = require('chai');
const expect = chai.expect;

    const creds = new PasswordScoringLib({
        password: 'password',
        userInputs: ['']
    });

    const creds2 = new PasswordScoringLib({
        password: '90b62b67-f372-4da5-967b-eb53688afb65',
        userInputs: ['']
    });

    const creds3 = new PasswordScoringLib({
        password: '90b62b67-f372-4da5-967b-eb53688afb65',
        userInputs: ['90b62b67-f372-4da5-967b-eb53688afb65']
});

    describe('Password Scoring Test', function () {

        it('checks a known pwned password', function (done) {
            creds.assessPassword({}, function (err, res) {
                console.log(JSON.stringify(res, null, 2));
                expect(res).to.have.own.property('score');
                expect(res).to.have.own.property('pwned');
                expect(res.score).to.equal(0);
                expect(res.pwned).to.be.above(0);
                done();
            });
        });

        it('checks a strong password', function (done) {
            creds2.assessPassword({}, function (err, res) {
                console.log(JSON.stringify(res, null, 2));
                expect(res).to.have.own.property('score');
                expect(res).to.have.own.property('pwned');
                expect(res.score).to.equal(4);
                expect(res.pwned).to.equal(0);
                done();
            });
        });

        it('checks a strong password with matching username', function (done) {
            creds3.assessPassword({}, function (err, res) {
                console.log(JSON.stringify(res, null, 2));
                expect(res).to.have.own.property('score');
                expect(res).to.have.own.property('pwned');
                expect(res.score).to.equal(0);
                expect(res.pwned).to.equal(0);
                done();
            });
        });
    });

