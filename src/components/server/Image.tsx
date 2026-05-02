import { SpinIcon } from '@juki-team/base-ui/server-components';
import ImageComp from 'next/image';
import { FC } from 'types';
import { type ImageCmpProps } from '@juki-team/base-ui/types';

export const Image: FC<ImageCmpProps> = ({ src, className, alt, height, width, style }) => {
  
  if (src) {
    if (width && height) {
      return (
        <ImageComp
          src={src}
          className={className}
          alt={alt}
          height={height}
          width={width}
          style={style}
          fetchPriority="high"
          priority
        />
      );
    }
    
    return (
      <ImageComp
        src={src}
        className={className}
        alt={alt}
        fill
        style={{ objectFit: 'contain' }}
        fetchPriority="high"
        priority
      />
    );
  }
  
  return <SpinIcon />;
};
