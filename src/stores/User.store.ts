import { makeAutoObservable, runInAction } from "mobx";
import {
  makePersistable,
  clearPersistedStore,
  getPersistedStore,
  stopPersisting,
  isHydrated,
  isPersisting,
  hydrateStore,
  startPersisting,
  pausePersisting, StorageController,
} from "mobx-persist-store";
import { getUserRequest } from "../domains/user/user.services";
import { IUser } from "../domains/user/user.types";

export class UserStore {
  user: IUser | null = null;

  constructor(storage: StorageController) {
    makeAutoObservable(this, {}, { autoBind: true });

    makePersistable(this, {
      name: "UserStore",
      properties: ["user"],
      storage: storage,

    });
  }

  get isHydrated(): boolean {
    return isHydrated(this);
  }

  get isPersisting(): boolean {
    return isPersisting(this);
  }

  async clearPersistedData(): Promise<void> {
    await clearPersistedStore(this);
  }

  pausePersist(): void {
    pausePersisting(this);
  }

  startPersist(): void {
    startPersisting(this);
  }

  disposePersist(): void {
    stopPersisting(this);
  }

  async rehydrateStore(): Promise<void> {
    await hydrateStore(this);
  }

  async getPersistedData(): Promise<void> {
    const data = await getPersistedStore(this);

    alert(JSON.stringify(data));
  }

  async loadRandomUser(): Promise<void> {
    const { data } = await getUserRequest();

    if (data) {
      runInAction(() => {
        this.user = data.results[0];
      });
    }
  }
}
