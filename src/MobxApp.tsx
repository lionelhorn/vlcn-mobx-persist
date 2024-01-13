import { Container, Divider, Header, List } from "semantic-ui-react";
import { FC } from "react";
import { DbStorageContext } from "./utils/storage/useDbStorage.ts";
import { AppBody } from "./AppBody.tsx";
import { useDB } from "@vlcn.io/react";
import { SqliteStorageController } from "./utils/storage/SqliteStorageController.ts";
import { configure } from "mobx";
import { configurePersistable } from "mobx-persist-store";

// https://mobx.js.org/configuration.html#configuration-
configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: false,
});

configurePersistable({
  debugMode: false,
});

export const MobxApp: FC<{ dbName: string }> = ({ dbName }) => {
  const ctx = useDB(dbName);
  return (
    <Container style={{ margin: 20 }}>
      <Header as="h1" dividing>
        Mobx Persist Store with MobX 6 (v1.0) + VLCN sqlite as storage
      </Header>
      <List bulleted>
        <List.Item
          as="a"
          content="Based on demo from Mobx Persist Store"
          href="https://github.com/quarrant/mobx-persist-store"
          target="_blank"
        />
        <List.Item
          as="a"
          content="Replaced localStorage with VLCN sqlite browser side"
          href="https://github.com/vlcn-io/vite-starter"
          target="_blank"
        />
      </List>
    <Container>
      <div style={{fontSize: "15px"}}>
        Open another browser and navigate to <a href={location.href}>this window's url</a> to test sync on page reload. <br/>(No live changes on page but backing storage changes are realtime)
      </div>
    </Container>
      <Divider hidden />
      <DbStorageContext.Provider value={new SqliteStorageController(ctx)}>
        <AppBody dbName={dbName} />
      </DbStorageContext.Provider>
    </Container>
  );
};