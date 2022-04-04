import styled from 'styled-components';
import { scaleLinear, scaleBand } from 'd3-scale';
import { format } from 'd3-format';
import Data from './Data/data.json';

const El = styled.div`
    width: 100%;
  `;

const NEIGHBOURS = [
  'HUN',
  'BLR',
  'MDA',
  'POL',
  'ROU',
  'RUS',
  'SVK',
];

export const BarChart = () => {
  const svgWidth = 960;
  const svgHeight = 350;

  const dataFiltered = Data.filter((d) => d['Product Group'] === 'All Products' && NEIGHBOURS.indexOf(d['Alpha-3 code-1']) !== -1);

  const xScale = scaleBand()
    .domain(dataFiltered.map((d) => d['Alpha-3 code-1']))
    .range([0, svgWidth])
    .padding(0.2);

  const heightScale = scaleLinear()
    .domain([-500000, 2500000])
    .range([svgHeight, 0]);
  return (
    <El>
      <svg width='960px' viewBox={`0 0 ${svgWidth} ${svgHeight + 20}`}>
        <g>
          {
            dataFiltered.map((d, i) => (
              <g key={i}>
                <rect
                  x={xScale(d['Alpha-3 code-1'])}
                  y={heightScale(Math.max(0, d['Export (US$ Thousand)'] - d['Import (US$ Thousand)']))}
                  width={xScale.bandwidth() / 2 - 1}
                  fill='#CF0303'
                  height={Math.abs(heightScale(d['Export (US$ Thousand)'] - d['Import (US$ Thousand)']) - heightScale(0))}
                  rx={5}
                  ry={5}
                />
                <text
                  x={xScale(d['Alpha-3 code-1']) as number + (((xScale.bandwidth() / 2) - 1) / 2)}
                  y={heightScale(d['Export (US$ Thousand)'])}
                  textAnchor='middle'
                  dy={-5}
                  fill='#CF0303'
                  fontSize={14}
                >
                  {format('$.2s')((d['Export (US$ Thousand)'] - d['Import (US$ Thousand)']) * 1000).replace('G', 'B')}
                </text>
                <text
                  x={xScale(d['Alpha-3 code-1']) as number + (xScale.bandwidth() / 2)}
                  y={svgHeight}
                  textAnchor='middle'
                  dy={15}
                  fill='#212121'
                  fontSize={14}
                  fontWeight='bold'
                >
                  {d['Country or Area']}
                </text>
              </g>
            ))
          }
        </g>
      </svg>
    </El>
  );
};
