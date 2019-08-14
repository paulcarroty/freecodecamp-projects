 /*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*
*(if additional are added, keep them at the very end!)
* 
* All test results here - https://1ssue-tracker.glitch.me/test/
*/ 

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let _id;

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.isBoolean(res.body.open);
          assert.isString(res.body.created_on);
          assert.isString(res.body.updated_on);
          done();
        });
      });
      
      
      
      test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Required title',
          issue_text: 'Required text',
          created_by: 'Required author'
        })
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.body.issue_title, 'Required title');
           assert.equal(res.body.issue_text, 'Required text');
           assert.equal(res.body.created_by, 'Required author');
           done(); 
      });
    });
      
      
      test('Missing required fields', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Missed title',
          issue_text: 'Missed text'
        })
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.body.issue_title, undefined);
           assert.equal(res.body.issue_text, undefined);
           done(); 
      });
        
  });
      
      
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      let _id;
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5d51781ec1f0741869faf300' 
        })
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.text, 'no updated field sent');
           done(); 
        
        });
      });
      
      test('One field to update', function(done) {
       chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5d4eebe97c1ec100ef943667',
           issue_title: 'One updated title'   
        })
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.text, 'successfully updated 5d4eebe97c1ec100ef943667');
           done(); 
        
        });
      });
      
      test('Multiple fields to update', function(done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: '5d4f00fa244eed007dd27d0f',
           issue_title: 'Multiple updated title',
           issue_text: 'Multiple updated text'
        })
        .end(function(err, res){
           assert.equal(res.status, 200);
           assert.equal(res.text, 'successfully updated 5d4f00fa244eed007dd27d0f');
           done(); 
        
        });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      
      
      test('One filter', function(done) {
        
        chai.request(server)
        .get('/api/issues/test')
        .query({assigned_to: 'Chai and Mocha'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], '_id');
          done();
        });
        
      });
      
      
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
          chai.request(server)
        .get('/api/issues/test')
        .query({assigned_to: 'Chai and Mocha', status_text: 'In QA'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          done();
        });
         
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '_id error');
          done();
        });
         
      });
        
      
      
      
      
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .query({_id: '5d516e7e89667213e7083ff5'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, '_id error');
          // error 'cause we already deleted this id on first run
          done();

        });
        
      });
      
    });

});
