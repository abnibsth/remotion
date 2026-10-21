import { Petir } from "./Petir";
import { LumoraLaunch } from "./Lumora";
import { DreamDungeon, Bedroom, Arrival, Meeting, RemSleep, Victory } from "./DreamDungeon";
import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="KenapaPetirBisaMuncul" component={Petir} durationInFrames={1800} fps={60} width={1080} height={1920} />
      <Composition id="PetirPrototype" component={Petir} durationInFrames={600} fps={60} width={1080} height={1920} />
      <Composition id="DreamDungeon" component={DreamDungeon} durationInFrames={2400} fps={60} width={1080} height={1920} />
      <Folder name="Dream-Dungeon-Scenes">
        <Composition id="Dream-Bedroom" component={Bedroom} durationInFrames={510} fps={60} width={1080} height={1920} />
        <Composition id="Dream-Arrival" component={Arrival} durationInFrames={450} fps={60} width={1080} height={1920} />
        <Composition id="Dream-Guardian" component={Meeting} durationInFrames={546} fps={60} width={1080} height={1920} />
        <Composition id="Dream-REM" component={RemSleep} durationInFrames={552} fps={60} width={1080} height={1920} />
        <Composition id="Dream-Victory" component={Victory} durationInFrames={462} fps={60} width={1080} height={1920} />
      </Folder>
      <Composition id="LumoraLaunch" component={LumoraLaunch} durationInFrames={600} fps={60} width={1920} height={1080} />
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />

    </>
  );
};
