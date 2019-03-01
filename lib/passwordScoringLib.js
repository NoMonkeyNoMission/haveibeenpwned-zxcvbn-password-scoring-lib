var _ = require('underscore');
var zxcvbn = require('zxcvbn');
var crypto = require('crypto');
var axios = require('axios');

var configDefaults = {
    password: '',
    userInputs: [],
    score: 0,
    pwned: 0,
};

function PasswordScoringLib(config) {
    this._config = _.extend(_.clone(configDefaults), config || {});
}

module.exports = PasswordScoringLib;

PasswordScoringLib.prototype.assessPassword = async function(params, callback) {

    let self = this;

    let credsToAssess = _.extend(_.clone(self._config), params || {});
    let assessment = {
        score: credsToAssess.score,
        pwned: credsToAssess.pwned
    };

    const pwnedUrl = p => `https://api.pwnedpasswords.com/range/${p}`;

    const hash = await crypto
        .createHash('sha1')
        .update(credsToAssess.password)
        .digest('hex')
        .toUpperCase();

    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);

    let result = await axios.get(pwnedUrl(prefix))
            .then(result => result.data)
            .catch(err => {
                return callback(err, null);
            });

    if (!result) return callback(new Error(`Empty result from haveibeenpwned`));

    const pwned = result.includes(suffix);

    // if password is pwned, zxcvbn score should be set to 0
    assessment.score = pwned ? 0 : zxcvbn(credsToAssess.password, credsToAssess.userInputs).score;

    // if password is not pwned, pwned should be set to 0
    assessment.pwned = !pwned ? 0 : +result
        .split('\r\n')
        .find(r => r.includes(suffix))
        .split(':')
        .pop();
    callback(null, assessment);

};
