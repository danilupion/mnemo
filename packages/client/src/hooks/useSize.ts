import { RefObject, useLayoutEffect, useRef, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

const useSize = <T extends HTMLElement = HTMLDivElement>(): [RefObject<T>, Size] => {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === ref.current) {
          setSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [ref, size];
};

export default useSize;
