import styled from 'styled-components';
import { format } from 'd3-format';
import { ChoroplethHoverDataType } from './Types';

interface Props {
  data: ChoroplethHoverDataType;
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

export const ChoroplethTooltip = (props: Props) => {
  const {
    data,
  } = props;
  return (
    <TooltipEl x={data.xPosition} y={data.yPosition}>
      <h6 className='undp-typography margin-top-05 margin-botom-05' style={{ padding: '0 var(--spacing-05)' }}>
        {data.country}
      </h6>
      <hr className='undp-style' />
      {
        data.countryISO === 'UKR' || data.countryISO === 'RUS' ? null
          : (
            <div style={{ padding: 'var(--spacing-05) var(--spacing-05) 0 var(--spacing-05)' }}>
              <h6 className='bold undp-typography'>{data.productGroup}</h6>
              <p className='undp-typography'>
                {data.exporter === 'Both' ? "Russia's and Ukraine's" : `${data.exporter}'s`}
                {' '}
                share of import in
                {' '}
                {data.country}
                :
                {' '}
                <span className='bold'>
                  {data.percent.toFixed(2)}
                  % (
                  {format('$.3s')(data.value * 1000).replace('G', 'B')}
                  )
                  {' '}
                </span>
              </p>
            </div>
          )
      }
    </TooltipEl>
  );
};
