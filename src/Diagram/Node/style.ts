import {css} from '@emotion/css';

export const NODE_WIDTH = 250;
export const NODE_HEIGHT = 150;
export const NODE_BUTTON_SIZE = 32;

export const NodeStyleReset = css`
  fill: transparent;
  stroke: transparent;
`;

export const NodeWrapper = css`
  position: relative;
`;

export const NodeContent = css`
  display: flex;
  gap: 1.6rem;
  width: ${NODE_WIDTH}px;
  height: ${NODE_HEIGHT - NODE_BUTTON_SIZE / 2}px;
  padding: 1.6rem;
  border: 1px solid var(--mc-automation-node-stroke);
  border-left: 4px solid currentColor;
  border-radius: 2px;
  background-color: var(--mc-automation-node-background);
  transition: 0.2s ease-in-out;
  cursor: pointer;

  &[aria-selected='true'] {
    border-color: currentColor;
    box-shadow: var(--elevation-z2);
  }
`;

export const NodeIcon = css`
  font-size: 20px;
  align-self: center;
`;

export const NodeDetails = css`
  display: grid;
  grid-template-rows: auto 1fr auto;
  row-gap: 0.2rem;
  color: var(--mc-automation-node-foreground);

  > h1 {
    margin-bottom: 0;
    font-size: 14px;
  }

  > p {
    margin-bottom: 0;
    max-width: 180px;
    height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > dl {
    margin-bottom: 0.8rem;
    display: flex;
    align-self: end;
    gap: 1.6rem;
    font-size: 12px;

    dt,
    dd {
      display: inline;
    }

    dt {
      text-transform: capitalize;
      margin-right: 4px;

      &::after {
        content: ':';
      }

      + dd {
        font-weight: bold;
      }
    }
  }
`;

export const AddButton = css`
  position: absolute;
  left: 50%;
  transform: translate(-50%, ${NODE_BUTTON_SIZE / 2}px);
  bottom: 0;
`;
