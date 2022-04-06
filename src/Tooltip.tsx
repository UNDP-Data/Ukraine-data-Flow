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
  z-index: 10;
  border-radius: 1rem;
  font-size: 1.4rem;
  background-color: var(--white);
  box-shadow: 0 0 1rem rgb(0 0 0 / 15%);
  word-wrap: break-word;
  top: ${(props) => props.y - 40}px;
  left: ${(props) => props.x + 20}px;
  max-width: 32rem;
`;

const TooltipTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--navy);  
  background: var(--yellow);
  width: 100%;
  box-sizing: border-box;
  border-radius: 1rem 1rem 0 0;
  padding: 1.6rem 4rem 1.6rem 2rem;
  position: relative;
  font-weight: 700;
  font-size: 1.8rem;
  line-height: 1.8rem;
`;

const TooltipBody = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 2rem 2rem 0 2rem;
`;

const TooltipHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BodyTitleEl = styled.div`
  font-size: 1.4rem;
  line-height: 2.2rem;
`;

const ValueDiv = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--primary-blue);
  margin: 0 0 2rem 0;
`;

export const Tooltip = (props: Props) => {
  const {
    data,
  } = props;
  const dataSelectedCategory = Data.filter((d) => d['Alpha-3 code-1'] === data.countryISO && d['Product Group'] === data.productGroup);
  return (
    <TooltipEl x={data.xPosition} y={data.yPosition}>
      <TooltipHead>
        <TooltipTitle>
          {data.country}
        </TooltipTitle>
      </TooltipHead>
      <TooltipBody>
        <BodyTitleEl>
          Total
          {' '}
          <span className='bold'>{data.tradeType === 'Imports' ? 'exports to' : 'imports from'}</span>
          {' '}
          Ukraine of
          {' '}
          <span className='bold'>{data.productGroup}</span>
        </BodyTitleEl>
        <ValueDiv>
          {format('$.4s')(dataSelectedCategory[0][data.tradeType === 'Imports' ? 'Export (US$ Thousand)' : 'Import (US$ Thousand)'] * 1000).replace('G', 'B')}
        </ValueDiv>
      </TooltipBody>
    </TooltipEl>
  );
};
