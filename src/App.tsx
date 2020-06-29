/**@jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const chooseImages = async () => {
  const handles = await window.chooseFileSystemEntries({
    multiple: true,
    accepts: [
      {
        description: 'Image file',
        mimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
      },
    ],
  });
  const files = await Promise.all(handles.map((handle) => handle.getFile()));
  const images = files.map((file) => {
    return URL.createObjectURL(file);
  });
  return images;
};

const App: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  const handleClick = useCallback(async () => {
    const result = await chooseImages();
    setImages(result);
  }, []);

  const imageLength = useRef(0);

  useEffect(() => {
    imageLength.current = images.length - 1;
  }, [images]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          setIndex((prev) => (prev === imageLength.current ? prev : prev + 1));
          break;
        case 'ArrowLeft':
          setIndex((prev) => (prev ? prev - 1 : 0));
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, []);

  return (
    <div>
      {images.length === 0 ? (
        <button onClick={handleClick}>画像選択</button>
      ) : (
        <React.Fragment>
          <p
            css={css`
              font-size: 4vw;
            `}
          >
            {index + 1}個目
          </p>
          <div
            css={css`
              overflow-x: hidden;
            `}
          >
            <div
              style={{
                transform: `translateX(-${100 * index}vw)`,
              }}
              css={css`
                display: grid;
                grid-auto-flow: column;
                & > * {
                  width: 100vw;
                  height: auto;
                }
              `}
            >
              {images.map((image, i) => {
                return <img src={image} key={i} />;
              })}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default App;
