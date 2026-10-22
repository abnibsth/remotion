import { FixOneBug } from "./FixOneBug";
import { PhpIsDead, PhpAnnouncement, PhpPredictions, PhpSilence, PhpComeback, PhpPunchline, PhpTerminal } from "./PhpIsDead";
import { ChaosToOrder } from "./ChaosToOrder";
import { ScienceOfDownforce } from "./Downforce";
import { Petir } from "./Petir";
import { WordsHaveWeight } from "./WordsHaveWeight";
import { ClickALink } from "./ClickALink";
import { MotionCardListicle } from "./MotionCardListicle";
import { VerveCommercial } from "./Verve";
import { WhereDidMyMoneyGo } from "./WhereDidMyMoneyGo";
import { EverythingIsMotion } from "./EverythingIsMotion";
import { AbniBanner } from "./AbniBanner";
import { MotionShowreel, Opening as ShowreelOpening, Shapes as ShowreelShapes, Typography as ShowreelTypography, Dimension as ShowreelDimension, Chaos as ShowreelChaos, Finale as ShowreelFinale } from "./Showreel";
import { SejukSigap } from "./Sejuk";
import { NotifikasiOverload, HookScene, ComingScene, ChaosScene, BreakdownScene, SilenceScene, SolutionScene, PayoffScene } from "./Notifikasi";
import { LumoraLaunch } from "./Lumora";
import { GajianV2, GajianV2Prototype } from "./GajianV2";
import { Gajian, SalaryScene, SultanScene, RealityScene, BalanceScene, SilenceScene as GajianSilenceScene, WaitingScene } from "./Gajian";
import { DreamDungeon, Bedroom, Arrival, Meeting, RemSleep, Victory } from "./DreamDungeon";
import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="FixOneBug" component={FixOneBug} durationInFrames={1200} fps={60} width={1080} height={1920} />
      <Composition id="FixOneBugPrototype" component={FixOneBug} durationInFrames={600} fps={60} width={1080} height={1920} />
      <Composition id="PhpIsDead" component={PhpIsDead} durationInFrames={1200} fps={60} width={1080} height={1920} />
      <Composition id="PhpIsDeadPrototype" component={PhpIsDead} durationInFrames={480} fps={60} width={1080} height={1920} />
      <Folder name="PHP-Scenes">
        <Composition id="PHP-Announcement" component={PhpAnnouncement} durationInFrames={180} fps={60} width={1080} height={1920} />
        <Composition id="PHP-Predictions" component={PhpPredictions} durationInFrames={300} fps={60} width={1080} height={1920} />
        <Composition id="PHP-Silence" component={PhpSilence} durationInFrames={120} fps={60} width={1080} height={1920} />
        <Composition id="PHP-Comeback" component={PhpComeback} durationInFrames={240} fps={60} width={1080} height={1920} />
        <Composition id="PHP-Punchline" component={PhpPunchline} durationInFrames={240} fps={60} width={1080} height={1920} />
        <Composition id="PHP-Terminal" component={PhpTerminal} durationInFrames={120} fps={60} width={1080} height={1920} />
      </Folder>
      <Composition id="ChaosToOrder" component={ChaosToOrder} durationInFrames={1200} fps={60} width={1080} height={1920} />
      <Composition id="ChaosToOrderPrototype" component={ChaosToOrder} durationInFrames={480} fps={60} width={1080} height={1920} />
      <Composition id="ScienceOfDownforce" component={ScienceOfDownforce} durationInFrames={1800} fps={60} width={1080} height={1920} />
      <Composition id="DownforcePrototype" component={ScienceOfDownforce} durationInFrames={600} fps={60} width={1080} height={1920} />
      <Composition id="KenapaPetirBisaMuncul" component={Petir} durationInFrames={1800} fps={60} width={1080} height={1920} />
      <Composition id="PetirPrototype" component={Petir} durationInFrames={600} fps={60} width={1080} height={1920} />
      <Composition id="WordsHaveWeight" component={WordsHaveWeight} durationInFrames={1200} fps={60} width={1080} height={1920} />
      <Composition id="WordsHaveWeightPrototype" component={WordsHaveWeight} durationInFrames={480} fps={60} width={1080} height={1920} />
      <Composition id="ClickALink" component={ClickALink} durationInFrames={1800} fps={60} width={1920} height={1080} />
      <Composition id="ClickALinkPrototype" component={ClickALink} durationInFrames={600} fps={60} width={1920} height={1080} />
      <Composition id="MotionCardListicle" component={MotionCardListicle} durationInFrames={1500} fps={60} width={1080} height={1920} />
      <Composition id="MotionCardListiclePrototype" component={MotionCardListicle} durationInFrames={390} fps={60} width={1080} height={1920} />
      <Composition id="VerveCommercial" component={VerveCommercial} durationInFrames={1200} fps={60} width={1920} height={1080} />
      <Composition id="VervePrototype" component={VerveCommercial} durationInFrames={420} fps={60} width={1920} height={1080} />
      <Composition id="WhereDidMyMoneyGoVO" component={WhereDidMyMoneyGo} durationInFrames={1200} fps={60} width={1920} height={1080} defaultProps={{narrated:true}} />
      <Composition id="WhereDidMyMoneyGo" component={WhereDidMyMoneyGo} durationInFrames={1200} fps={60} width={1920} height={1080} />
      <Composition id="WhereDidMyMoneyGoPrototype" component={WhereDidMyMoneyGo} durationInFrames={300} fps={60} width={1920} height={1080} />
      <Composition id="EverythingIsMotion" component={EverythingIsMotion} durationInFrames={1200} fps={60} width={1920} height={1080} />
      <Composition id="EverythingIsMotionPrototype" component={EverythingIsMotion} durationInFrames={360} fps={60} width={1920} height={1080} />
      <Composition id="AbniGithubBanner" component={AbniBanner} durationInFrames={240} fps={30} width={1280} height={360} />
      <Composition id="AbniGithubMaster" component={AbniBanner} durationInFrames={240} fps={30} width={2560} height={720} />
      <Composition id="MotionShowreel" component={MotionShowreel} durationInFrames={900} fps={60} width={1920} height={1080} />
      <Folder name="Showreel-Scenes">
        <Composition id="Showreel-Opening" component={ShowreelOpening} durationInFrames={120} fps={60} width={1920} height={1080} />
        <Composition id="Showreel-Shapes" component={ShowreelShapes} durationInFrames={150} fps={60} width={1920} height={1080} />
        <Composition id="Showreel-Typography" component={ShowreelTypography} durationInFrames={150} fps={60} width={1920} height={1080} />
        <Composition id="Showreel-Dimension" component={ShowreelDimension} durationInFrames={180} fps={60} width={1920} height={1080} />
        <Composition id="Showreel-Chaos" component={ShowreelChaos} durationInFrames={150} fps={60} width={1920} height={1080} />
        <Composition id="Showreel-Finale" component={ShowreelFinale} durationInFrames={150} fps={60} width={1920} height={1080} />
      </Folder>
      <Composition id="SejukSigap" component={SejukSigap} durationInFrames={870} fps={30} width={1080} height={1920} />
      <Composition id="GajianV2" component={GajianV2} durationInFrames={900} fps={30} width={1080} height={1920} />
      <Composition id="GajianV2Prototype" component={GajianV2Prototype} durationInFrames={210} fps={30} width={1080} height={1920} />
      <Composition id="Gajian" component={Gajian} durationInFrames={900} fps={30} width={1080} height={1920} />
      <Folder name="Gajian-Scenes">
        <Composition id="Gajian-Salary" component={SalaryScene} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Gajian-Sultan" component={SultanScene} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Gajian-Reality" component={RealityScene} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Gajian-Balance" component={BalanceScene} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Gajian-Silence" component={GajianSilenceScene} durationInFrames={150} fps={30} width={1080} height={1920} />
        <Composition id="Gajian-Waiting" component={WaitingScene} durationInFrames={150} fps={30} width={1080} height={1920} />
      </Folder>
      <Composition id="NotifikasiOverload" component={NotifikasiOverload} durationInFrames={600} fps={30} width={1080} height={1920} />
      <Composition id="NotifikasiOverload60" component={NotifikasiOverload} durationInFrames={1200} fps={60} width={1080} height={1920} />
      <Folder name="Notifikasi-Scenes">
        <Composition id="Notifikasi-Hook" component={HookScene} durationInFrames={75} fps={30} width={1080} height={1920} />
        <Composition id="Notifikasi-Coming" component={ComingScene} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="Notifikasi-Chaos" component={ChaosScene} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Notifikasi-Breakdown" component={BreakdownScene} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="Notifikasi-Silence" component={SilenceScene} durationInFrames={90} fps={30} width={1080} height={1920} />
        <Composition id="Notifikasi-Solution" component={SolutionScene} durationInFrames={75} fps={30} width={1080} height={1920} />
        <Composition id="Notifikasi-Payoff" component={PayoffScene} durationInFrames={60} fps={30} width={1080} height={1920} />
      </Folder>
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
