/* eslint-disable @typescript-eslint/no-use-before-define */

import {useCallback, useRef, FC} from 'react';
import {
  Canvas,
  CanvasRef,
  ZoomResult,
  LayoutResult,
  ElkCanvasLayoutOptions
} from 'reaflow';
import {Button, Tooltip} from 'antd';
import {
  CameraOutlined,
  CompressOutlined,
  FullscreenExitOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons';
import {Edge} from './Edge';
import {Node} from './Node';
import {convertSvgToPng, triggerDownload} from '../svgToPng';

import type {NodeStruct, EdgeStruct} from '../model';

import * as css from './style';

const CANVAS_SIZE = 5000;

interface LayoutOptionsProps extends ElkCanvasLayoutOptions {
  'elk.portAlignment.default':
    | 'DISTRIBUTED'
    | 'JUSTIFIED'
    | 'BEGIN'
    | 'CENTER'
    | 'END';
}

const LayoutOptions: LayoutOptionsProps = {
  'elk.algorithm': 'elk.layered',
  'elk.direction': 'DOWN',
  'elk.portAlignment.default': 'CENTER',
  'elk.spacing.nodeNode': '80',
  'elk.spacing.portPort': '1'
};

interface DiagramProps {
  selectedId?: string;
  edges: EdgeStruct[];
  nodes: NodeStruct[];
  onAddClick(node: NodeStruct): void;
  onNodeClick(node: NodeStruct): void;
  onEdgeClick(edge: EdgeStruct): void;
}

export const Diagram: FC<DiagramProps> = ({
  edges,
  nodes,
  selectedId,
  onAddClick,
  onEdgeClick,
  onNodeClick
}) => {
  const canvasRef = useRef<CanvasRef>(null);

  const action = useCallback(
    (type: CanvasAction) => {
      if (!canvasRef.current) return undefined;

      return canvasAction(canvasRef.current, type);
    },
    [canvasRef]
  );

  const onDownload = useCallback(async () => {
    const svg = canvasRef.current?.svgRef.current;

    if (!svg) return;

    const png = await convertSvgToPng(svg, svg.clientWidth, svg.clientHeight);
    const contentUrl = URL.createObjectURL(png);

    triggerDownload(contentUrl, 'diagram-snapshot.png');
  }, [canvasRef]);

  return (
    <div className={css.Wrapper}>
      <Controls
        onZoomIn={() => action('zoomIn')}
        onZoomOut={() => action('zoomOut')}
        onZoomReset={() => action('zoomReset')}
        onDownload={() => onDownload()}
      />
      <div className={css.Canvas}>
        <Canvas
          fit
          center
          pannable
          zoomable
          animated
          ref={canvasRef}
          maxWidth={CANVAS_SIZE}
          maxHeight={CANVAS_SIZE}
          selections={selectedId ? [selectedId] : undefined}
          nodes={nodes}
          edges={edges}
          layoutOptions={LayoutOptions}
          node={
            <Node
              selectedId={selectedId}
              onAddClick={onAddClick}
              onNodeClick={onNodeClick}
            />
          }
          edge={<Edge onEdgeClick={onEdgeClick} />}
        />
      </div>
    </div>
  );
};

interface ControlsProps {
  onZoomIn: ZoomResult['zoomIn'];
  onZoomOut: ZoomResult['zoomOut'];
  onZoomReset: LayoutResult['fitCanvas'];
  onDownload(): void;
}

const Controls: FC<ControlsProps> = ({
  onDownload,
  onZoomIn,
  onZoomOut,
  onZoomReset
}) => (
  <div className={css.Controls}>
    <Control title="Zoom In" onClick={onZoomIn} icon={<ZoomInOutlined />} />

    <Control title="Zoom Out" onClick={onZoomOut} icon={<ZoomOutOutlined />} />

    <Control
      title="Reset Zoom"
      onClick={onZoomReset}
      icon={<CompressOutlined />}
    />

    <Control title="Exit Fullscreen" icon={<FullscreenExitOutlined />} />

    <Control
      title="Diagram Snapshot"
      onClick={onDownload}
      icon={<CameraOutlined />}
    />
  </div>
);

interface ControlProps {
  title: string;
  icon: JSX.Element;
  onClick?(): void;
}

const Control: FC<ControlProps> = ({title, icon, onClick}) => (
  <Tooltip title={title} placement="right">
    <Button size="large" shape="circle" icon={icon} onClick={onClick} />
  </Tooltip>
);

// --- Helpers
type CanvasAction = 'zoomIn' | 'zoomOut' | 'zoomReset';

function canvasAction(instance: CanvasRef, type: CanvasAction) {
  switch (type) {
    case 'zoomIn':
      console.log('Zoom In');
      return instance.zoomIn ? instance.zoomIn() : undefined;

    case 'zoomOut':
      console.log('Zoom Out');
      return instance.zoomOut ? instance.zoomOut() : undefined;

    case 'zoomReset':
      console.log('Zoom Reset');
      return instance.fitCanvas ? instance.fitCanvas() : undefined;
  }
}
