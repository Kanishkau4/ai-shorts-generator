import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={300} // This will be dynamic
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          images: [],
          audioUrl: "",
          captions: [],
        }}
      />
    </>
  );
};
