import React, { useRef } from 'react';

const ResizableHeader = ({ columnName, columnWidth, onResize, children }) => {
  const resizerRef = useRef(null);

  const onMouseDown = (e) => {
    let startX = e.clientX;

    const onMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      onResize(columnName, deltaX);
      startX = moveEvent.clientX;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <th
      className="relative px-4 py-2 border"
      style={{ minWidth: `${columnWidth}px` }}
    >
      <div className="flex items-center justify-between select-none">
        {children}
        <div
          ref={resizerRef}
          className="absolute right-0 top-0 h-full w-[10px] bg-[#E5E7EB] cursor-col-resize"
          onMouseDown={onMouseDown}
        ></div>
      </div>
    </th>
  );
};

export default ResizableHeader;
