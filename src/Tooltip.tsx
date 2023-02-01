import styled from 'styled-components';
import { format } from 'd3-format';
import Data from './Data/data.json';
import { HoverDataType } from './Types';

interface Props {
  data: HoverDataType;
}

interface TooltipElProps {
  x: number;
  y: number;
}

const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 8;
  background-color: var(--gray-200);
  border: 1px solid var(--gray-300);
  word-wrap: break-word;
  top: ${(props) => props.y - 40}px;
  left: ${(props) => props.x + 20}px;
  max-width: 24rem;
`;

export const Tooltip = (props: Props) => {
  const {
    data,
  } = props;
  const dataSelectedCategory = Data.filter((d) => d['Alpha-3 code-1'] === data.countryISO && d['Product Group'] === data.productGroup);
  return (
    <TooltipEl x={data.xPosition} y={data.yPosition}>
      <h6 className='undp-typography margin-top-05 margin-botom-05' style={{ padding: '0 var(--spacing-05)' }}>
        {data.country}
      </h6>
      <hr className='undp-style' />
      <div style={{ padding: 'var(--spacing-05)' }}>
        <p className='undp-typography margin-bottom-00'>
          Total
          {' '}
          <span className='bold'>{data.tradeType === 'Imports' ? 'exports to' : 'imports from'}</span>
          {' '}
          Ukraine of
          {' '}
          <span className='bold'>{data.productGroup}</span>
        </p>
        <h6 className='undp-typography margin-bottom-00 bold'>
          {format('$.4s')(dataSelectedCategory[0][data.tradeType === 'Imports' ? 'Export (US$ Thousand)' : 'Import (US$ Thousand)'] * 1000).replace('G', 'B')}
        </h6>
      </div>
    </TooltipEl>
  );
};
