import { ImageResponse } from 'next/og';
import { JukiChristmasIcon } from './JukiChristmasIcon';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(<JukiChristmasIcon />, { ...size });
}
