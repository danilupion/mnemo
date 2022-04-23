import { createContext, useContext } from 'react';

import tableStore, { TableStore } from '../stores/table';
import uiStore, { UiStore } from '../stores/ui';
import userStore, { UserStore } from '../stores/user';

interface StoreContext {
  table: TableStore;
  user: UserStore;
  ui: UiStore;
}

const storeContext = createContext<StoreContext>({
  table: tableStore,
  user: userStore,
  ui: uiStore,
});

export default () => useContext(storeContext);

export const useTableStore = () => useContext(storeContext).table;

export const useUiStore = () => useContext(storeContext).ui;

export const useUserStore = () => useContext(storeContext).user;
