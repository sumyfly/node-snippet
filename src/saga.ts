// generator的特点是执行到某一步时，可以把控制权交给外部代码，由外部代码拿到返回结果后，决定该怎么做。

function channel() {
  let taker;
  function take(cb) {
    taker = cb;
  }

  function put(input) {
    if (taker) {
      const tempTaker = taker;
      taker = null;
      tempTaker(input);
    }
  }

  return {
    put,
    take,
  };
}

const chan = channel();

function take() {
  return {
    type: 'take',
  };
}

function runTakeEffect(effect, next) {
  console.log('effect', effect);
  chan.take(input => {
    next(input);
  });
}

function* takeEvery(worker) {
  yield fork(function*() {
    while (true) {
      const action = yield take();
      worker(action);
    }
  });
}

function* mainSaga() {
  yield takeEvery(action => {
    console.log('action', action);
  });
}

function fork(cb) {
  return {
    type: 'fork',
    fn: cb,
  };
}

function runForkEffect(effect, cb) {
  task(effect.fn || effect);
  cb();
}

function task(iterator) {
  const iter = typeof iterator === 'function' ? iterator() : iterator;
  function next(args?: any) {
    const result = iter.next(args);
    if (!result.done) {
      const effect = result.value;

      // 判断effect是否是iterator
      if (typeof effect[Symbol.iterator] === 'function') {
        runForkEffect(effect, next);
      } else if (effect.type) {
        switch (effect.type) {
          case 'take':
            runTakeEffect(effect, next);
            break;
          case 'fork':
            runForkEffect(effect, next);
            break;
          default:
        }
      }
    }
  }
  next();
}

task(mainSaga);
chan.put({ type: 'add', payload: { a: 1, b: 2 } });
chan.put({ type: 'add', payload: { a: 4, b: 2 } });