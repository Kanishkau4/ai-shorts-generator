"use client";

import { useState, useRef } from "react";
import { ArrowRight, ArrowLeft, Play, Pause, Check, Volume2 } from "lucide-react";

export const LANGUAGES = [
  {
    language: "English",
    countryCode: "US",
    countryFlag: "🇺🇸",
    modelName: "deepgram",
    modelLangCode: "en-US",
  },
  {
    language: "Spanish",
    countryCode: "MX",
    countryFlag: "🇲🇽",
    modelName: "deepgram",
    modelLangCode: "es-MX",
  },
  {
    language: "German",
    countryCode: "DE",
    countryFlag: "🇩🇪",
    modelName: "deepgram",
    modelLangCode: "de-DE",
  },
  {
    language: "French",
    countryCode: "FR",
    countryFlag: "🇫🇷",
    modelName: "deepgram",
    modelLangCode: "fr-FR",
  },
  {
    language: "Dutch",
    countryCode: "NL",
    countryFlag: "🇳🇱",
    modelName: "deepgram",
    modelLangCode: "nl-NL",
  },
  {
    language: "Italian",
    countryCode: "IT",
    countryFlag: "🇮🇹",
    modelName: "deepgram",
    modelLangCode: "it-IT",
  },
  {
    language: "Japanese",
    countryCode: "JP",
    countryFlag: "🇯🇵",
    modelName: "deepgram",
    modelLangCode: "ja-JP",
  },
];

export const DEEPGRAM_VOICES = [
  {
    model: "deepgram",
    modelName: "aura-2-odysseus-en",
    preview: "deepgram-aura-2-odysseus-en.wav",
    gender: "male",
  },
  {
    model: "deepgram",
    modelName: "aura-2-thalia-en",
    preview: "deepgram-aura-2-thalia-en.wav",
    gender: "female",
  },
  {
    model: "deepgram",
    modelName: "aura-2-amalthea-en",
    preview: "deepgram-aura-2-amalthea-en.wav",
    gender: "female",
  },
  {
    model: "deepgram",
    modelName: "aura-2-andromeda-en",
    preview: "deepgram-aura-2-andromeda-en.wav",
    gender: "female",
  },
  {
    model: "deepgram",
    modelName: "aura-2-apollo-en",
    preview: "deepgram-aura-2-apollo-en.wav",
    gender: "male",
  },
];

interface StepLanguageVoiceProps {
  onNext: (data: { language: string; voice: string }) => void;
  onBack: () => void;
  defaultValues?: { language?: string; voice?: string };
}

export function StepLanguageVoice({
  onNext,
  onBack,
  defaultValues,
}: StepLanguageVoiceProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    defaultValues?.language || LANGUAGES[0].modelLangCode
  );
  const [selectedVoice, setSelectedVoice] = useState<string>(
    defaultValues?.voice || ""
  );

  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPreview = (previewUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (playingPreview === previewUrl) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingPreview(null);
      return;
    }

    // Play new
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(`/voices/${previewUrl}`);
    audio.onended = () => setPlayingPreview(null);
    audio.play().catch((err) => {
      console.warn("Audio playback failed. The file might not exist in public folder:", err);
      // Fallback for visual demo purposes if file doesn't exist
      setTimeout(() => setPlayingPreview(null), 2000); 
    });
    audioRef.current = audio;
    setPlayingPreview(previewUrl);
  };

  const handleContinue = () => {
    if (selectedLanguage && selectedVoice) {
      onNext({ language: selectedLanguage, voice: selectedVoice });
    }
  };

  const isValid = !!selectedLanguage && !!selectedVoice;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Language & Voice</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the language for your video scripts and select a voice model to
          narrate them.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Language Selection */}
        <div className="flex-1 flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground">Language</label>
          <div
            className="grid grid-cols-2 gap-2 overflow-y-auto pr-1"
            style={{ maxHeight: "360px" }}
          >
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.modelLangCode;
              return (
                <button
                  key={lang.modelLangCode}
                  onClick={() => setSelectedLanguage(lang.modelLangCode)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? "border-foreground bg-foreground/5 shadow-sm"
                      : "border-border/50 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/w40/${lang.countryCode.toLowerCase()}.png`}
                    alt={`${lang.language} flag`}
                    className="w-6 h-auto rounded-sm object-cover shadow-sm"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">
                      {lang.language}
                    </span>
                    <span className="text-[10px] uppercase text-muted-foreground font-medium">
                      {lang.modelLangCode}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="ml-auto w-4 h-4 rounded-full bg-foreground flex items-center justify-center">
                      <Check size={10} strokeWidth={3} className="text-background" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice Selection */}
        <div className="flex-[1.2] flex flex-col gap-3">
          <label className="text-sm font-medium text-foreground">
            Available Voices
          </label>
          <div
            className="flex flex-col gap-2 overflow-y-auto pr-1"
            style={{ maxHeight: "360px" }}
          >
            {DEEPGRAM_VOICES.map((voice) => {
              const isSelected = selectedVoice === voice.modelName;
              const isPlaying = playingPreview === voice.preview;

              return (
                <div
                  key={voice.modelName}
                  onClick={() => setSelectedVoice(voice.modelName)}
                  className={`group relative flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-foreground bg-foreground/5 shadow-sm"
                      : "border-border/50 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  {/* Play Button */}
                  <button
                    onClick={(e) => handlePlayPreview(voice.preview, e)}
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isPlaying
                        ? "bg-foreground text-background scale-110 shadow-md"
                        : "bg-muted border border-border/50 text-foreground group-hover:bg-foreground group-hover:text-background"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause size={16} className="fill-current" />
                    ) : (
                      <Play size={16} className="fill-current ml-0.5" />
                    )}
                  </button>

                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground truncate">
                        {voice.modelName.replace("aura-2-", "").replace("-en", "").charAt(0).toUpperCase() + voice.modelName.replace("aura-2-", "").replace("-en", "").slice(1)}
                      </span>
                      {isSelected && (
                        <span className="shrink-0 w-4 h-4 rounded-full bg-foreground flex items-center justify-center">
                          <Check size={10} strokeWidth={3} className="text-background" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                        {voice.gender}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase">
                        <Volume2 size={12} />
                        {voice.model}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-border/40 mt-auto">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold transition-all hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
