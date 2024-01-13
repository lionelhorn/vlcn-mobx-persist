import { StorageController } from "mobx-persist-store";
import { createContext, useContext } from "react";

type DbStorageContextType = StorageController | null;

export let DbStorageContext = createContext<DbStorageContextType>(null);

export const useDbStorage = (): DbStorageContextType => {
  const context = useContext<DbStorageContextType>(DbStorageContext);

  if (context === undefined) {
    throw new Error(`useDbStorage must be used within a DbStorageContext Provider`);
  }

  return context;
};
