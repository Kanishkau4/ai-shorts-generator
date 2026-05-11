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
  captionStyle?: string;
};

export const MainVideo: React.FC<MainVideoProps> = ({
  images,
  audioUrl,
  captions,
  captionStyle = "hormozi",
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

      <Captions captions={captions} styleId={captionStyle} />
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

const Captions: React.FC<{ captions: WordCaption[]; styleId: string }> = ({ captions, styleId }) => {
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

  // Base styles
  let containerStyle: React.CSSProperties = {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "100%", // Lower third
  };

  let textStyle: React.CSSProperties = {
    fontFamily: "Inter, sans-serif",
    fontSize: "80px",
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
    padding: "20px",
    maxWidth: "90%",
  };

  // Apply Specific Styles
  if (styleId === "hormozi") {
    textStyle = {
      ...textStyle,
      color: "yellow",
      WebkitTextStroke: "3px black",
      textShadow: "4px 4px 0px black, 0px 0px 20px rgba(0,0,0,0.8)",
      transform: `scale(${scale})`,
    };
  } else if (styleId === "minimalist") {
    textStyle = {
      ...textStyle,
      fontSize: "60px",
      fontWeight: "500",
      color: "white",
      textTransform: "none",
      textShadow: "0px 2px 10px rgba(0,0,0,0.5)",
      opacity: interpolate(progressIntoGroup, [0, 10], [0, 1]),
    };
  } else if (styleId === "neon") {
    textStyle = {
      ...textStyle,
      fontSize: "70px",
      color: "#00ffff",
      fontStyle: "italic",
      textShadow: "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff",
      transform: `scale(${scale})`,
    };
  } else if (styleId === "typewriter") {
    textStyle = {
      ...textStyle,
      fontFamily: "monospace",
      fontSize: "50px",
      color: "white",
      backgroundColor: "rgba(0,0,0,0.7)",
      padding: "10px 20px",
      borderRadius: "8px",
      textTransform: "none",
    };
  } else if (styleId === "karaoke") {
    textStyle = {
      ...textStyle,
      color: "white",
      WebkitTextStroke: "2px black",
    };
    textStyle.transform = `scale(${scale})`;
    textStyle.color = "yellow";
  } else if (styleId === "boxed") {
    textStyle = {
      ...textStyle,
      fontSize: "70px",
      backgroundColor: "white",
      color: "black",
      padding: "15px 30px",
      boxShadow: "10px 10px 0px black",
      transform: `rotate(-2deg) scale(${scale})`,
    };
  }

  return (
    <AbsoluteFill style={containerStyle}>
      <div style={textStyle}>
        {activeGroup.words}
      </div>
    </AbsoluteFill>
  );
};
