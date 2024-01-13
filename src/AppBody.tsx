import { FC, useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Grid,
  Icon,
  Image,
  Label,
  Menu,
  Segment,
} from "semantic-ui-react";
import { observer } from "mobx-react";
import { UserStore } from "./stores/User.store";
import { useDbStorage } from "./utils/storage/useDbStorage.ts";
import { useSync } from "@vlcn.io/react";
import SyncWorker from "./sync-worker.js?worker";
import { SqliteStorageController } from "./utils/storage/SqliteStorageController.ts";

function getEndpoint() {
  let proto = "ws:";
  const host = window.location.host;
  if (window.location.protocol === "https:") {
    proto = "wss:";
  }

  return `${proto}//${host}/sync`;
}

const worker = new SyncWorker();

export const AppBody: FC<{ dbName: string }> = observer(({ dbName }) => {
  useSync({
    dbname: dbName,
    endpoint: getEndpoint(),
    room: dbName,
    worker,
  });

  const storage = useDbStorage() as SqliteStorageController;

  const [localStore] = useState(() => new UserStore(storage));

  useEffect(() => {
    return () => localStore.disposePersist();
  }, [localStore]);

  const LastUpdate = () => {
    const storage = useDbStorage() as SqliteStorageController;
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
      (async () => {
        const l = await storage?.getLastUpdate("UserStore");
        if (l) setLastUpdate(l);
      })();
    }, [storage]);

    return (
      <div>
        Last update
        <Label
          floating={true}
        >
          {lastUpdate?.toLocaleTimeString()
          }
        </Label>
      </div>
    );
  };

  return (
    <Segment placeholder={true}>
      <div>
        <Menu compact={true}>
          <Menu.Item as="a">
            Store Hydrated
            <Label
              color={localStore.isHydrated ? "teal" : "red"}
              floating={true}
            >
              {localStore.isHydrated ? "Yes" : "No"}
            </Label>
          </Menu.Item>
          <Menu.Item as="a">
            Store Persisting
            <Label
              color={localStore.isPersisting ? "teal" : "red"}
              floating={true}
            >
              {localStore.isPersisting ? "On" : "Off"}
            </Label>
          </Menu.Item>
          <Menu.Item as="a">
            <LastUpdate />
          </Menu.Item>
        </Menu>
      </div>
      <Grid columns={2} relaxed="very" verticalAlign="middle" centered={true}>
        <Grid.Column>
          {!localStore.user && (
            <Button
              basic={true}
              color="green"
              onClick={localStore.loadRandomUser}
            >
              Load Random User
            </Button>
          )}
          {localStore.user && (
            <Card centered={true}>
              <Card.Content>
                <Image
                  floated="right"
                  size="mini"
                  src={localStore.user.picture.thumbnail}
                />
                <Card.Header>
                  {localStore.user.name.first} {localStore.user.name.last}
                </Card.Header>
                <Card.Meta>{localStore.user.email}</Card.Meta>
                <Card.Description>
                  {localStore.user.location.city},{" "}
                  {localStore.user.location.country}
                </Card.Description>
              </Card.Content>
              <Card.Content extra={true}>
                <div className="ui two buttons">
                  <Button
                    basic={true}
                    color="green"
                    onClick={localStore.loadRandomUser}
                  >
                    Load Random User
                  </Button>
                </div>
              </Card.Content>
            </Card>
          )}
        </Grid.Column>

        <Grid.Column>
          <Grid>
            <Grid.Column>
              <Button
                attached="top"
                content="Reload Browser"
                color="blue"
                icon="redo"
                onClick={() => window.location.reload()}
              />
              <Segment attached="bottom" color="blue">
                <Icon name="arrow left" />
                Clicking &quot;Load Random User&quot; will update the Mobx store and
                at the same time data is saved locally to sqlite via VLCN.
                <br />
                <br />
                Refresh the browser and you will notice the data will be loaded
                into the store automatically.
              </Segment>
            </Grid.Column>
          </Grid>
          <Grid>
            <Grid.Column>
              <Button
                attached="top"
                content="Clear Store Persist"
                color="red"
                icon="delete"
                onClick={localStore.clearPersistedData}
              />
              <Segment attached="bottom" color="red">
                Calling <b>clearPersistedStore</b> in the store will remove the
                saved data from sqlite.
                <br />
                <br />
                After clicking &quot;Clear Store Persist&quot;,{" "}
                <b>reload the browser</b>.
              </Segment>
            </Grid.Column>
          </Grid>
          <Grid>
            <Grid.Column>
              <Button
                attached="top"
                content="Pause Store Persist"
                color="orange"
                icon="pause"
                onClick={localStore.pausePersist}
              />
              <Button
                attached="top"
                content="Restart Store Persist"
                color="orange"
                icon="play"
                onClick={localStore.startPersist}
              />
              <Button
                attached="top"
                content="Hydrate Store"
                color="purple"
                icon="spinner"
                onClick={localStore.rehydrateStore}
              />
              <Segment attached="bottom" color="orange">
                Calling <b>pausePersisting</b> in the store will stop saving any
                changes to the store but the saved data will still live in sqlite.<br />
                <br />
                If you click "Pause Store Persist" then click "Load Random User"
                and click "Rehydrate Store". You will notice it only saved the
                last data before you stopped listening for changes in the store.
                <br />
                <br />
                If you want to restart persisting data you can call{" "}
                <b>startPersisting</b> in the store and it will start saving any
                changes to the store again.
              </Segment>

              <Button
                content="Get Store Persist"
                color="green"
                icon="upload"
                onClick={localStore.getPersistedData}
              />
            </Grid.Column>
          </Grid>
        </Grid.Column>
      </Grid>

      <Divider vertical={true}>Demo</Divider>
    </Segment>
  );
});
