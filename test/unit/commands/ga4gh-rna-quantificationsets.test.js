'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const getStub = sinon.stub();
const postStub = sinon.stub();
const delStub = sinon.stub();
const printSpy = sinon.spy();
let callback;

const mocks = {
  '../../ga4gh': {
    get: getStub,
    post: postStub,
    del: delStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  }
};

const list = proxyquire('../../../lib/cmds/genomics_cmds/list-rna-quantification-sets', mocks);

test.always.afterEach(t => {
  getStub.resetHistory();
  postStub.resetHistory();
  delStub.resetHistory();
  printSpy.resetHistory();
  callback = null;
});

test.serial.cb('The "ga4gh-rnaquantificationsets" command should list rna sets for an account', t => {
  const res = { data: { rnaquantificationsets: [] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/rnaquantificationsets/search');
    t.deepEqual(postStub.getCall(0).args[2], {
      datasetIds: [
        'dataset'
      ],
      pageSize: 25,
      pageToken: undefined,
      status: 'INDEXING'
    });
    t.is(printSpy.callCount, 1);
    t.true(printSpy.calledWith({ rnaquantificationsets: [] }));
    t.end();
  };

  yargs.command(list)
    .parse('list-rna-quantification-sets dataset --status INDEXING');
});
