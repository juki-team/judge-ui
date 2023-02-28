import { LoadingIcon } from 'components';
import ImageComp from 'next/image';
import { ImageCmpProps } from 'types';

export const Image = ({ src, className, alt, height, width, style }: ImageCmpProps) => {
  // {/*<span className="next-js-image">*/}
  // {/*    /!*<img src={src} className={className} alt={alt} width={width} height={height} style={style} />*!/*/}
  // </span>
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
  return <LoadingIcon />;
};
