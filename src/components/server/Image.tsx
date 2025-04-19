import { SpinIcon } from '@juki-team/base-ui/server-components';
import ImageComp from 'next/image';
import { FC, ImageCmpProps } from 'types';

export const Image: FC<ImageCmpProps> = ({ src, className, alt, height, width, style }) => {
  
  if (src) {
    return (
      <ImageComp
        src={src}
        className={className}
        alt={alt}
        height={height}
        width={width}
        style={style}
      />
    );
  }
  
  return <SpinIcon />;
};
