import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import React from "react";

export type WordCaption = {
  word: string;
  start: number;
  end: number;
};

export type MainVideoProps = {
  images: string[];
  audioUrl: string;
  captions: WordCaption[];
};

export const MainVideo: React.FC<MainVideoProps> = ({
  images,
  audioUrl,
  captions,
}) => {
  const { fps, durationInFrames } = useVideoConfig();

  const totalDurationSeconds = durationInFrames / fps;
  const imageDurationInFrames = images.length > 0 ? Math.floor(durationInFrames / images.length) : durationInFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {audioUrl && <Audio src={audioUrl} />}

      {images.map((imgUrl, index) => {
        const startFrame = index * imageDurationInFrames;
        
        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={imageDurationInFrames}
          >
            <AnimatedImage src={imgUrl} index={index} />
          </Sequence>
        );
      })}

      <Captions captions={captions} />
    </AbsoluteFill>
  );
};

const AnimatedImage: React.FC<{ src: string; index: number }> = ({ src, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const animationType = index % 3;
  const style: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

  if (animationType === 0) {
    const scale = interpolate(frame, [0, fps * 5], [1, 1.2], {
      extrapolateRight: "clamp",
    });
    style.transform = `scale(${scale})`;
  } else if (animationType === 1) {
    const translateY = interpolate(frame, [0, fps * 5], [0, -50], {
      extrapolateRight: "clamp",
    });
    style.transform = `scale(1.1) translateY(${translateY}px)`;
  } else {
    const opacity = interpolate(frame, [0, 15], [0, 1], {
      extrapolateRight: "clamp",
    });
    const scale = interpolate(frame, [0, fps * 5], [1, 1.1], {
      extrapolateRight: "clamp",
    });
    style.opacity = opacity;
    style.transform = `scale(${scale})`;
  }

  return (
    <AbsoluteFill>
      <Img src={src} style={style} />
    </AbsoluteFill>
  );
};

const Captions: React.FC<{ captions: WordCaption[] }> = ({ captions }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  if (!captions || captions.length === 0) return null;

  const groups: { words: string; startFrame: number; endFrame: number }[] = [];
  let currentGroup = [];
  
  for (let i = 0; i < captions.length; i++) {
    currentGroup.push(captions[i]);
    
    if (currentGroup.length >= 2 || i === captions.length - 1) {
      groups.push({
        words: currentGroup.map(c => (c as { punctuated_word?: string, word: string }).punctuated_word || c.word).join(" "),
        startFrame: Math.floor(currentGroup[0].start * fps),
        endFrame: Math.ceil(currentGroup[currentGroup.length - 1].end * fps),
      });
      currentGroup = [];
    }
  }

  const activeGroup = groups.find(
    (g) => frame >= g.startFrame && frame <= g.endFrame
  );

  if (!activeGroup) return null;

  // Add a slight pop animation to words when they appear
  const progressIntoGroup = frame - activeGroup.startFrame;
  const scale = interpolate(progressIntoGroup, [0, 5], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "100%", // Lower third
      }}
    >
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "80px",
          fontWeight: "900",
          color: "yellow",
          textAlign: "center",
          WebkitTextStroke: "3px black",
          textShadow: "4px 4px 0px black, 0px 0px 20px rgba(0,0,0,0.8)",
          textTransform: "uppercase",
          transform: `scale(${scale})`,
          padding: "20px",
          maxWidth: "80%",
        }}
      >
        {activeGroup.words}
      </div>
    </AbsoluteFill>
  );
};
