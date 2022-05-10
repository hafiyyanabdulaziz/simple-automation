import {Node as ReaflowNode, NodeProps as ReaflowNodeProps} from 'reaflow';
import {nodeConfig} from './nodeConfig';
import {Button} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

import type {FC} from 'react';
import type {NodeStruct, EdgeStruct} from '../../model';

import * as css from './style';

interface NodeStatsProps {
  showStats?: boolean;
  stats?: Record<string, number>;
}

const NodeStats: FC<NodeStatsProps> = ({showStats, stats}) =>
  showStats && stats ? (
    <dl>
      {Object.entries(stats).map(([label, count], index) => (
        <span key={`${label}_${index}`}>
          <dt>{label}</dt>
          <dd>{count}</dd>
        </span>
      ))}
    </dl>
  ) : null;

interface NodeContentProps extends NodeStruct {
  selected?: boolean;
  onClick?(): void;
}

const NodeContent: FC<NodeContentProps> = ({id, selected, onClick, data}) => {
  const type = data?.type || 'source';
  const title = data?.title || 'Node Title';
  const description = data?.description || 'Node Description';

  const {color, icon} = nodeConfig(type);

  return (
    <div
      className={css.NodeContent}
      style={{color}}
      onClick={onClick}
      aria-selected={selected}
    >
      <div className={css.NodeIcon}>{icon}</div>
      <div className={css.NodeDetails}>
        <h1>
          {title} (ID: {id})
        </h1>
        <p>{description}</p>
        <NodeStats stats={data?.stats} showStats={data?.showStats} />
      </div>
    </div>
  );
};

interface NodeChildProps {
  node: NodeStruct;
  nodes?: NodeStruct[];
  edges?: EdgeStruct[];
  disabled?: boolean;
  selected?: boolean;
  onAddClick?(node: NodeStruct): void;
  onNodeClick?(node: NodeStruct): void;
}

const renderNodeContent: FC<NodeChildProps> = ({
  node,
  disabled,
  selected,
  onAddClick,
  onNodeClick
}): JSX.Element => {
  return (
    <foreignObject x={0} y={0} width={node.width} height={node.height}>
      <div className={css.NodeWrapper}>
        <NodeContent
          selected={selected}
          id={node.id}
          data={node.data}
          onClick={onNodeClick ? () => onNodeClick(node) : undefined}
        />

        {/* Add Button */}
        {node.data?.type === 'end' ? null : (
          <div className={css.AddButton}>
            <Button
              disabled={disabled}
              size="middle"
              shape="circle"
              icon={<PlusOutlined />}
              onClick={onAddClick ? () => onAddClick(node) : undefined}
            />
          </div>
        )}
      </div>
    </foreignObject>
  );
};

interface NodeProps extends Partial<ReaflowNodeProps> {
  selectedId?: string;
  onAddClick?(node: NodeStruct): void;
  onNodeClick?(node: NodeStruct): void;
}

export const Node: FC<NodeProps> = ({
  selectedId,
  onAddClick,
  onNodeClick,
  ...props
}) => {
  return (
    <ReaflowNode
      {...props}
      removable={false}
      selectable={false}
      className={css.NodeStyleReset}
    >
      {(event) => {
        const isDisabled = event.node.disabled;
        const isSelected = selectedId === event.node.id;

        return renderNodeContent({
          ...event,
          disabled: isDisabled,
          selected: isSelected,
          onAddClick,
          onNodeClick
        });
      }}
    </ReaflowNode>
  );
};
