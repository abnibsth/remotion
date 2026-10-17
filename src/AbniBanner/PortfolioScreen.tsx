import React from "react";
import { staticFile } from "remotion";
import { mix, smooth } from "./motion";
import { portfolioAssets, portfolioAt } from "./portfolio";

export const PortfolioScreen: React.FC<{
  time: number;
  width: number;
  height: number;
}> = ({ time, width, height }) => {
  const mobile = smooth(time, 3.5, 4.48);
  const { mobileBlend } = portfolioAt(time);
  const inset = mix(1, 5, mobile);
  const top = mix(27, 22, mobile);
  const screenWidth = Math.max(1, width - inset * 2);
  const screenHeight = Math.max(1, height - top - mix(2, 10, mobile));
  return (
    <g>
      <g opacity={1 - mobile}>
        <path d={`M0 26H${width}`} stroke="#30353A" />
        {[0, 1, 2].map((i) => (
          <circle
            key={i}
            cx={14 + i * 8}
            cy="13"
            r="2"
            fill={i ? "#51565B" : "#B8F36B"}
          />
        ))}
        <rect
          x={width * 0.26}
          y="6"
          width={width * 0.48}
          height="14"
          rx="4"
          fill="#252B30"
        />
        <text
          x={width / 2}
          y="16"
          textAnchor="middle"
          fontFamily="IBM Plex Mono, monospace"
          fontSize="8"
          fill="#D5DAD4"
        >
          abnibasit.me
        </text>
      </g>
      <g opacity={mobile}>
        <rect
          x={width / 2 - 22}
          y="8"
          width="44"
          height="7"
          rx="3.5"
          fill="#07090B"
        />
        <rect
          x={width / 2 - 18}
          y={height - 7}
          width="36"
          height="2"
          rx="1"
          fill="#92979C"
        />
      </g>
      <svg
        x={inset}
        y={top}
        width={screenWidth}
        height={screenHeight}
        overflow="hidden"
      >
        <image
          href={staticFile(portfolioAssets.desktop)}
          width={screenWidth}
          height={screenHeight}
          preserveAspectRatio="xMidYMin slice"
        />
        <image
          href={staticFile(portfolioAssets.mobile)}
          width={screenWidth}
          height={screenHeight}
          preserveAspectRatio="xMidYMin slice"
          opacity={mobileBlend}
        />
      </svg>
    </g>
  );
};
