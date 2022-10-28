import ImageComp from 'next/image';
import { CSSProperties } from 'react';

interface ImageProps {
  src: string,
  className?: string,
  alt: string,
  height: number,
  width: number,
  style?: CSSProperties,
}

export const Image = ({ src, className, alt, height, width, style }: ImageProps) => {
  return (
    <span className="next-js-image">
      <ImageComp
        src={src}
        className={className}
        alt={alt}
        height={height}
        width={width}
        style={style}
      />
    </span>
  );
};
