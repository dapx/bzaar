import stores from '../myStores';
import * as Actions from '../../actions/myStores';

const INITIAL_STATE = {
  loadingRequest: false,
  list: [],
  store: {},
  products: [],
  product: {},
  size: {},
};

const PRODUCT = {
  data: {
    id: 1,
    name: 'teste',
    description: 'teste',
  },
};

const STORE = {
  data: {
    id: 1,
    name: 'teste',
    description: 'teste',
  },
};

const SIZE = {
  name: 'P',
  quantity: 1,
  price: 120,
};

const SIZE_2 = {
  name: 'M',
  quantity: 1,
  price: 130,
};

test('product was saved', () => {
  const result = stores(INITIAL_STATE, Actions.savedProduct(PRODUCT));
  expect(result.product).toEqual(PRODUCT.data);
  expect(result.products).toEqual([PRODUCT.data]);
});


test('store was saved', () => {
  const result = stores(INITIAL_STATE, Actions.savedStore(STORE));
  const STORE_WITH_LOADING_STATE = {
    ...STORE.data,
    loadingRequest: false,
  };
  expect(result.store).toEqual(STORE_WITH_LOADING_STATE);
  expect(result.list).toEqual([STORE.data]);
});

test('added size to product', () => {
  // Added product to state.
  const STATE_WITH_PRODUCT = stores(INITIAL_STATE, Actions.savedProduct(PRODUCT));
  // Added size to product in state.
  const STATE_WITH_PRODUCT_WITH_SIZE = stores(
    STATE_WITH_PRODUCT,
    Actions.addSizeAction(SIZE),
  );
  const productWithSize = { ...PRODUCT.data, sizes: [SIZE] };
  expect(STATE_WITH_PRODUCT_WITH_SIZE.product).toEqual(productWithSize);

  // Added second size to product in state
  const STATE_WITH_PRODUCT_WITH_TWO_SIZES = stores(
    STATE_WITH_PRODUCT_WITH_SIZE,
    Actions.addSizeAction(SIZE_2),
  );
  const productWithTwoSizes = { ...PRODUCT.data, sizes: [SIZE, SIZE_2] };
  expect(STATE_WITH_PRODUCT_WITH_TWO_SIZES.product).toEqual(productWithTwoSizes);

});

