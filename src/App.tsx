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

  const [backgroundColor, setBackgroundColor] = useState('#00FF00');
  const [counterBackgroundColor, setCounterBackgroundColor] = useState(
    '#ffffff',
  );
  const [color, setColor] = useState('#000000');

  return (
    <div
      style={{ backgroundColor, color }}
      css={css`
        min-height: 100vh;
        padding-top: 50px;
      `}
    >
      <p
        style={{ backgroundColor: counterBackgroundColor }}
        css={css`
          font-size: 4vw;
          width: fit-content;
          padding: 0px 1ch;
        `}
      >
        {index + 1}個目
      </p>
      {images.length === 0 ? (
        <React.Fragment>
          <fieldset>
            <label htmlFor="backgroundColor">背景色</label>
            <input
              value={backgroundColor}
              name="backgroundColor"
              type="color"
              onChange={(event) => {
                setBackgroundColor(event.currentTarget.value);
              }}
            />
          </fieldset>
          <fieldset>
            <label htmlFor="color">カウンター文字色</label>
            <input
              name="color"
              type="color"
              onChange={(event) => {
                setColor(event.currentTarget.value);
              }}
            />
          </fieldset>
          <fieldset>
            <label htmlFor="counterBackgroundColor">カウンター背景色</label>
            <input
              value={counterBackgroundColor}
              name="counterBackgroundColor"
              type="color"
              onChange={(event) => {
                setCounterBackgroundColor(event.currentTarget.value);
              }}
            />
          </fieldset>
          <button onClick={handleClick}>画像選択</button>
        </React.Fragment>
      ) : (
        <React.Fragment>
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
