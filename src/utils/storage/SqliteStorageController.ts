import { StorageController } from "mobx-persist-store";
import { CtxAsync } from "@vlcn.io/react";

export function first<T>(data: T[]): T | undefined {
  if (!data) {
    return undefined;
  }
  return data[0];
}

export function firstPick<T>(data: any[]): T | undefined {
  const d = data[0];
  if (d == null) {
    return undefined;
  }

  return d[Object.keys(d)[0]];
}

export class SqliteStorageController implements StorageController {
  constructor(private ctx: CtxAsync) {
  }

  async execAp<T extends {}>(sql: string, bind: string[] | undefined, postProcess?: (rows: T[]) => any) {
    const res = await this.ctx.db.execO<T>(sql, bind);
    return postProcess ? postProcess(res) : res;
  }

  async getItem<T>(key: string): Promise<string | T | null> {
    const res = await this.execAp<{
      data: string
    }>("SELECT data FROM store WHERE key = ?;", [key], firstPick) as string;
    return res ? JSON.parse(res) : null;
  }

  async getLastUpdate(key: string): Promise<Date | null> {
    const res = await this.execAp<{
      lastUpdate: string
    }>("SELECT lastUpdate FROM store WHERE key = ?;", [key], firstPick) as string;
    return res ? new Date(res) : null;
  }

  async removeItem(key: string): Promise<void> {
    await this.execAp("DELETE FROM store WHERE key = ?;", [key]);
  }

  async setItemBetterButIncompatibleVLCN(key: string, value: any): Promise<void> {
    console.log("setItem", key, value);
    const stmt = await this.ctx.db.prepare(`
                  INSERT INTO store (key, data) VALUES(?, ?)
                  ON CONFLICT(key) DO
                    UPDATE SET data = ?
                    WHERE key = ?;
                  `);

    const json = JSON.stringify(value);
    await stmt.get(this.ctx.db, key, json, json, key);
  }

  async setItem(key: string, value: any): Promise<void> {
    const existing = await this.getItem(key);
    const json = JSON.stringify(value);

    console.log("setItem", key, value, value);

    if (existing) {
      const update = await this.ctx.db.prepare(`UPDATE store SET data = ?, lastUpdate = ? WHERE key = ?;`);
      update.run(this.ctx.db, json, new Date().toString(), key);
    } else {
      const insert = await this.ctx.db.prepare(`INSERT INTO store (key, lastUpdate, data) VALUES(?, ?, ?)`);
      await insert.run(this.ctx.db, key, Date().toString(), json);
    }
  }
}