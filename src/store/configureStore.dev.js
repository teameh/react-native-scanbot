import { createStore, applyMiddleware } from 'redux';
import { autoRehydrate } from 'redux-persist';

import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'remote-redux-devtools';

import getRootReducer from '../reducers/getRootReducer';
import deleteImageMiddleware from './deleteImageMiddleware';
import uploadMiddleware from './uploadMiddleware';

const configureStore = (AppNavigator) => {

  // inject AppNavigator so we can create navigation reducer dynamically
  const rootReducer = getRootReducer(AppNavigator);

  // typical redux boilerplate
  const store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(
        deleteImageMiddleware, uploadMiddleware,
        createLogger({ collapsed: true, duration: true }),
      ),
      autoRehydrate()
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(() => {
      const getNextRootReducer = require('../reducers/getRootReducer').default;
      store.replaceReducer(getNextRootReducer(AppNavigator));
    });
  }

  return store;
};

export default configureStore;
