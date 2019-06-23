'use strict';

const yargs = require('yargs');
const sinon = require('sinon');
const test = require('ava');
const proxyquire = require('proxyquire');

const postStub = sinon.stub();
const printSpy = sinon.spy();
const readStub = sinon.stub();
let callback;

const mocks = {
  '../../api': {
    post: postStub
  },
  '../../print': (data, opts) => {
    printSpy(data, opts);
    callback();
  },
  '../../read': async () => readStub()
};

const program = proxyquire('../../../lib/cmds/insights_cmds/query', mocks);
const queryCohortCmd = proxyquire('../../../lib/cmds/insights_cmds/query-cohort', mocks);
const queryDatasetCmd = proxyquire('../../../lib/cmds/insights_cmds/query-dataset', mocks);

test.afterEach.always(t => {
  postStub.resetHistory();
  printSpy.resetHistory();
  readStub.resetHistory();
  callback = null;
});

test.serial.cb('The "insights-run-query" command should post a json query', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  readStub.onFirstCall().returns('{}');

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(program)
    .parse('query 1');
});

test.serial.cb('The "insights-run-query" command should post a json query', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(program)
    .parse('query 1 --sql "SELECT filter FROM gene"');
});

test.serial.cb('The "insights-run-query" command allows cohort to be used', t => {
  const query = { wicked: 'analyticsQuery' };
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  readStub.onFirstCall().returns(query);

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.deepEqual(postStub.getCall(0).args[2], {
      cohort_id: '2',
      query
    });
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(program)
    .parse('query 1 --cohortId 2');
});

test.serial.cb('The "query-cohort" command should post a json query', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  readStub.onFirstCall().returns('{}');

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(queryCohortCmd)
    .parse('query-cohort 1');
});

test.serial.cb('The "query-cohort" command should post a json query with sql option', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(queryCohortCmd)
    .parse('query-cohort 1 --sql "SELECT filter FROM gene"');
});

test.serial.cb('The "query-dataset" command should post a json query', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  readStub.onFirstCall().returns('{}');

  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(queryDatasetCmd)
    .parse('query-dataset 1');
});

test.serial.cb('The "query-dataset" command should post a json query with sql option', t => {
  const res = { data: { genes: ['A'], samples: ['X', 'Y', 'Z'] } };
  postStub.onFirstCall().returns(res);
  callback = () => {
    t.is(postStub.callCount, 1);
    t.is(postStub.getCall(0).args[1], '/v1/analytics/dsl');
    t.is(printSpy.callCount, 1);
    t.deepEqual(printSpy.getCall(0).args[0], res.data);
    t.end();
  };

  yargs.command(queryDatasetCmd)
    .parse('query-dataset 1 --sql "SELECT filter FROM gene"');
});
