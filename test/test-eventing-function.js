const assert = require('assert');
const requireFromString = require('require-from-string');
const fs = require('fs');
const path = require('path');

const filename = 'src/js/eventing-function.js';

function loadEventingFunction() {
    var file = path.join(__dirname, '/../src/js/eventing-function.js');
    var code = fs.readFileSync(file, 'utf8');

    code = 'global.customerBucket = {}; function log(msg){ console.log(msg); } ' + code + ' module.exports = { OnUpdate: OnUpdate, OnDelete: OnDelete };';

	return requireFromString(code, file);
}

const eventingFunction = loadEventingFunction();


describe('Test that the bucket variable is accessible', function () {
    it('should return an empty array', function () {
                
        assert.equal(Object.keys(customerBucket).length, 0);
    });
});

describe('Test that given a new dealsDetails document', function(){
    
    it('creates a new deals document', function() {

        const aNewDoc = {
            "ndg": "123",
            "dealId": "uno",
            "name": "house for a long long time"
        };
    
        const aNewDocMeta = {
            id : 'dealsDetails::123'
        };
    
        eventingFunction.OnUpdate(aNewDoc, aNewDocMeta);
        
        assert.equal(Object.keys(customerBucket).length, 1);
        assert.equal(customerBucket.hasOwnProperty('deals::123'), true);
    });

    it('contains the correct user reference', function() {
        assert.equal(customerBucket['deals::123'].ndg, '123');
    });

    it('contains the correct type reference', function() {
        assert.equal(customerBucket['deals::123'].type, 'deals');
    });

    it('contains an array of deals objects', function() {
        assert.equal(customerBucket['deals::123'].deals.length, 1);
    });

});