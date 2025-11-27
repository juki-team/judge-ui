import { Modal, T } from 'components';
import { useState } from 'react';

const images = [
  'https://pbs.twimg.com/media/G3sMdhgWgAAzMkh?format=jpg&name=medium',
  'https://pbs.twimg.com/media/G3sPyzcW4AAKARa?format=png&name=360x360',
  'https://pbs.twimg.com/media/G3tFqiHWEAAZmK3?format=jpg&name=4096x4096',
  'https://pbs.twimg.com/media/G3sHQ2xWEAAyJW2?format=png&name=900x900',
  'https://pbs.twimg.com/media/G3sZweOWgAAjQdG?format=png&name=small',
];

export const NotificationWarningModal = () => {
  
  const [ isOpen, setIsOpen ] = useState(true);
  const [ currentIndex, setCurrentIndex ] = useState(0);
  
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="jk-pg jk-col gap">
        <h3><T className="tt-se">sorry, the code editor and judging are down</T></h3>
        <T className="tt-se">a large portion of Juki App services are on AWS us-east-1, and us-east-1 is down</T>
        <div className="image-slider">
          <button className="slider-btn left" onClick={prevImage}>
            ◀
          </button>
          
          <img
            src={images[currentIndex]}
            alt={`slide-${currentIndex}`}
            className="slider-image"
          />
          
          <button className="slider-btn right" onClick={nextImage}>
            ▶
          </button>
        </div>
        <div className="dots">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};
