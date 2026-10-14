import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

/** A finite illustration, never a simulation of an actual candidate decision. */
export default function PipelineScene({ onReplay }: { onReplay: () => void }) {
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [playing, setPlaying] = useState(true);
  const [iteration, setIteration] = useState(0);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  function replay() {
    setIteration((i) => i + 1);
    setPlaying(true);
    onReplay();
  }
  return (
    <div className="flow-illustration">
      <div className="flow-caption">
        <span>THE CANDIDATE JOURNEY</span>
        <span>01 — 03</span>
      </div>
      <div
        key={iteration}
        className={`flow-scene ${playing && !reduced ? "is-playing" : "is-still"}`}
        onAnimationEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.animationName === "scene-clock"
          )
            setPlaying(false);
        }}
      >
        <svg
          viewBox="0 0 650 270"
          role="img"
          aria-labelledby="flow-title flow-description"
        >
          <title id="flow-title">
            From application to a considered next step
          </title>
          <desc id="flow-description">
            An illustrative profile moves from received applications through
            human review to a shortlist. No candidate records are changed.
          </desc>
          <defs>
            <linearGradient id="flow-line">
              <stop stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--success)" />
            </linearGradient>
          </defs>
          <path className="flow-track" d="M158 145H491" />
          <path className="flow-signal" d="M158 145H491" />
          <g className="flow-node flow-inbox">
            <rect
              className="flow-card ghost"
              x="32"
              y="66"
              width="142"
              height="154"
              rx="16"
              transform="rotate(-8 103 143)"
            />
            <rect
              className="flow-card"
              x="36"
              y="62"
              width="142"
              height="154"
              rx="16"
            />
            <text className="flow-number" x="53" y="88">
              01 / RECEIVED
            </text>
            <circle className="flow-avatar" cx="69" cy="119" r="15" />
            <path
              className="flow-icon"
              d="M64 115a5 5 0 1 0 10 0a5 5 0 1 0 -10 0M60 129q9-10 18 0"
            />
            <rect
              className="flow-text-line"
              x="94"
              y="111"
              width="60"
              height="5"
              rx="2"
            />
            <rect
              className="flow-text-line secondary"
              x="94"
              y="122"
              width="40"
              height="4"
              rx="2"
            />
            <path className="flow-rule" d="M53 148H159" />
            <text className="flow-label" x="53" y="177">
              A new possibility.
            </text>
            <text className="flow-small" x="53" y="195">
              Every profile matters
            </text>
          </g>
          <g className="flow-node flow-review">
            <rect
              className="flow-card"
              x="249"
              y="45"
              width="152"
              height="188"
              rx="18"
            />
            <text className="flow-number" x="267" y="73">
              02 / HUMAN REVIEW
            </text>
            <circle className="flow-review-ring" cx="325" cy="120" r="31" />
            <circle className="flow-avatar" cx="325" cy="120" r="23" />
            <path
              className="flow-icon"
              d="M319 114a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M313 133q12-16 24 0"
            />
            <text className="flow-label" x="267" y="176">
              Look a little closer.
            </text>
            <text className="flow-small" x="267" y="195">
              People make the call
            </text>
            <path className="flow-review-line" d="M267 212H383" />
          </g>
          <g className="flow-node flow-destination">
            <rect
              className="flow-card"
              x="473"
              y="62"
              width="142"
              height="154"
              rx="16"
            />
            <text className="flow-number" x="490" y="88">
              03 / NEXT STEP
            </text>
            <circle className="flow-success-circle" cx="544" cy="122" r="21" />
            <path className="flow-check" d="m534 122 7 7 13-14" />
            <text className="flow-label" x="490" y="177">
              Potential, noticed.
            </text>
            <text className="flow-small" x="490" y="195">
              A thoughtful shortlist
            </text>
          </g>
          <g className="flow-packet" aria-hidden="true">
            <rect x="-12" y="-15" width="24" height="30" rx="6" />
            <path d="M-6-5H6M-6 1H6M-6 7H2" />
          </g>
          <circle
            className="flow-arrival"
            cx="544"
            cy="122"
            r="30"
            aria-hidden="true"
          />
        </svg>
      </div>
      <div className="flow-mobile-labels" aria-hidden="true">
        <span>01 · Received</span>
        <span>02 · Human review</span>
        <span>03 · Next step</span>
      </div>
      <div className="flow-controls">
        <span>
          {reduced
            ? "Reduced motion · static illustration"
            : "Illustrative flow · no records change"}
        </span>
        <button
          type="button"
          disabled={reduced}
          onClick={playing ? () => setPlaying(false) : replay}
        >
          {playing && !reduced ? (
            <Pause size={14} />
          ) : iteration ? (
            <RotateCcw size={14} />
          ) : (
            <Play size={14} />
          )}
          {reduced ? "Motion off" : playing ? "Stop motion" : "Replay journey"}
        </button>
      </div>
    </div>
  );
}
