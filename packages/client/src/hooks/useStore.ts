import { createContext, useContext } from 'react';

import tableStore, { TableStore } from '../stores/table';

interface StoreContext {
  table: TableStore;
}

const storeContext = createContext<StoreContext>({
  table: tableStore,
});

export default () => useContext(storeContext);

export const useTableStore = () => useContext(storeContext).table;
