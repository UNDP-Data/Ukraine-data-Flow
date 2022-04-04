import {
  useRef, useState,
} from 'react';
import styled from 'styled-components';
import { geoEqualEarth } from 'd3-geo';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import sumBy from 'lodash.sumby';
import uniqBy from 'lodash.uniqby';
import { Select, Radio } from 'antd';
import { format } from 'd3-format';
import Data from './Data/data.json';
import World from './Data/worldMap.json';
import 'antd/dist/antd.css';
import { HoverDataType } from './Types';
import { Tooltip } from './Tooltip';

const El = styled.div`
  width: 100%;
`;

const SettingEl = styled.div`
  display: flex;
  align-items: center;
  margin: 2rem 0;
  justify-content: space-between;
`;

const RadioEl = styled.div`
  display: flex;
  align-items: center;
`;
const HeadingEl = styled.div`
  font-size: 2.4rem;
  font-weight: bold;
  line-height: 2.4rem;
  text-align: center;
  margin: 5rem 0 3rem 0;
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

export const FlowMap = () => {
  const svgWidth = 960;
  const svgHeight = 565;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);

  const options = uniqBy(Data, 'Product Group').map((d) => d['Product Group']);

  const [productGroup, setProductGroup] = useState('All Products');
  const [tradeType, setTradeType] = useState('Exports');
  const [regionType, setRegionType] = useState('Neighbours');
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(undefined);

  const dataFiltered = regionType === 'Neighbours' ? Data.filter((d) => NEIGHBOURS.indexOf(d['Alpha-3 code-1']) !== -1).filter((d) => d['Product Group'] === productGroup) : Data.filter((d) => d['Product Group'] === productGroup);

  const maxVal = productGroup === 'All Products' ? 5000000 : 5000000;

  const radiusScale = scaleSqrt().domain([0, maxVal]).range([0, regionType === 'Neighbours' ? 40 : 20]).nice();
  const strokeScale = scaleLinear().domain([0, maxVal]).range([0.5, regionType === 'Neighbours' ? 40 : 20]).nice();
  const projection = geoEqualEarth().rotate([0, 0]).scale(regionType === 'Neighbours' ? 2250 : 1000).translate(regionType === 'Neighbours' ? [-300, 2425] : [-100, 1200]);
  const UKRCenter = projection([32, 49]) as [number, number];

  return (
    <El>
      <SettingEl>
        <Select
          showSearch
          style={
            {
              minWidth: '25%',
              marginRight: '20px',
              fontSize: '1.6rem',
              fontWeight: 'bold',
            }
          }
          value={productGroup}
          size='middle'
          onChange={(d) => { setProductGroup(d); }}
        >
          {
            options.map((d) => (
              <Select.Option key={d}>{d}</Select.Option>
            ))
          }
        </Select>
        <RadioEl>
          <Radio.Group
            defaultValue='Neighbours'
            buttonStyle='solid'
            size='middle'
            onChange={(e) => { setRegionType(e.target.value); }}
            style={
              {
                marginRight: '20px',
              }
            }
          >
            <Radio.Button value='Neighbours'>Neighbouring Countries</Radio.Button>
            <Radio.Button value='Region'>Countries in Region</Radio.Button>
          </Radio.Group>
          <Radio.Group
            defaultValue='Exports'
            buttonStyle='solid'
            size='middle'
            onChange={(e) => { setTradeType(e.target.value); }}
          >
            <Radio.Button value='Exports'>Exports from Ukraine</Radio.Button>
            <Radio.Button value='Imports'>Imports to Ukraine</Radio.Button>
          </Radio.Group>
        </RadioEl>
      </SettingEl>
      <HeadingEl>
        Ukraine
        {' '}
        {tradeType === 'Exports' ? 'Exports of' : 'Imports of'}
        {' '}
        {productGroup}
        {' '}
        {tradeType === 'Exports' ? 'to' : 'from'}
        {' '}
        {regionType === 'Region' ? 'the Region' : 'the Neighbouring Countries'}
      </HeadingEl>
      <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`} ref={mapSvg}>
        <defs>
          <marker
            id='arrowhead'
            markerWidth='10'
            markerHeight='7'
            refX='0'
            refY='2'
            orient='auto'
          >
            <polygon points='0 0, 3 2, 0 4' />
          </marker>
        </defs>
        <g ref={mapG}>
          {
            (World as any).features.map((d: any, i: number) => {
              if ((regionType === 'Neighbours') && (NEIGHBOURS.indexOf(d.properties.ISO3) === -1) && (d.properties.ISO3 !== 'UKR')) return null;
              return (
                <g
                  key={i}
                  opacity={hoverData ? hoverData.countryISO === d.properties.ISO3 ? 1 : 0.2 : 1}
                  onMouseEnter={(event) => {
                    if (d.properties.ISO3 !== 'UKR') {
                      setHoverData({
                        countryISO: d.properties.ISO3,
                        country: d.properties.NAME,
                        tradeType,
                        productGroup,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }
                  }}
                  onMouseMove={(event) => {
                    if (d.properties.ISO3 !== 'UKR') {
                      setHoverData({
                        countryISO: d.properties.ISO3,
                        country: d.properties.NAME,
                        tradeType,
                        productGroup,
                        xPosition: event.clientX,
                        yPosition: event.clientY,
                      });
                    }
                  }}
                  onMouseLeave={() => {
                    setHoverData(undefined);
                  }}
                >
                  {
                    d.geometry.type === 'MultiPolygon' ? d.geometry.coordinates.map((el:any, j: any) => {
                      let masterPath = '';
                      el.forEach((geo: number[][]) => {
                        let path = ' M';
                        geo.forEach((c: number[], k: number) => {
                          const point = projection([c[0], c[1]]) as [number, number];
                          if (k !== geo.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                          else path = `${path}${point[0]} ${point[1]}`;
                        });
                        masterPath += path;
                      });
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          stroke='#006EB5'
                          strokeWidth={1}
                          strokeOpacity={0.5}
                          fill={d.properties.ISO3 !== 'UKR' ? '#f1f1f1' : '#94C4F5'}
                        />
                      );
                    }) : d.geometry.coordinates.map((el:any, j: number) => {
                      let path = 'M';
                      el.forEach((c: number[], k: number) => {
                        const point = projection([c[0], c[1]]) as [number, number];
                        if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                        else path = `${path}${point[0]} ${point[1]}`;
                      });
                      return (
                        <path
                          key={j}
                          d={path}
                          stroke='#006EB5'
                          strokeWidth={1}
                          strokeOpacity={0.5}
                          fill={d.properties.ISO3 !== 'UKR' ? '#f1f1f1' : '#94C4F5'}
                        />
                      );
                    })
                  }
                </g>
              );
            })

          }
          {
            dataFiltered.map((d, i) => {
              const center = projection([d['Longitude (average)'], d['Latitude (average)']]) as [number, number];
              return (
                <line
                  x2={tradeType === 'Imports' ? center[0] : UKRCenter[0]}
                  y2={tradeType === 'Imports' ? center[1] : UKRCenter[1]}
                  x1={tradeType === 'Imports' ? UKRCenter[0] : center[0]}
                  y1={tradeType === 'Imports' ? UKRCenter[1] : center[1]}
                  key={i}
                  className='path'
                  fill='none'
                  stroke='#006EB5'
                  opacity={hoverData ? hoverData.countryISO === d['Alpha-3 code-1'] ? 1 : 0.2 : 1}
                  strokeWidth={tradeType === 'Exports' ? strokeScale(d['Import (US$ Thousand)']) : strokeScale(d['Export (US$ Thousand)'])}
                  onMouseEnter={(event) => {
                    setHoverData({
                      countryISO: d['Alpha-3 code-1'],
                      country: d['Country or Area'],
                      tradeType,
                      productGroup,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseMove={(event) => {
                    setHoverData({
                      countryISO: d['Alpha-3 code-1'],
                      country: d['Country or Area'],
                      tradeType,
                      productGroup,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoverData(undefined);
                  }}
                />
              );
            })
          }
          {
            dataFiltered.map((d, i) => {
              const center = projection([d['Longitude (average)'], d['Latitude (average)']]) as [number, number];
              const radius = tradeType === 'Exports' ? radiusScale(d['Import (US$ Thousand)']) : radiusScale(d['Export (US$ Thousand)']);
              return (
                <g
                  key={i}
                  transform={`translate(${center[0]},${center[1]})`}
                  opacity={hoverData ? hoverData.countryISO === d['Alpha-3 code-1'] ? 1 : 0.2 : 1}
                  onMouseEnter={(event) => {
                    setHoverData({
                      countryISO: d['Alpha-3 code-1'],
                      country: d['Country or Area'],
                      tradeType,
                      productGroup,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseMove={(event) => {
                    setHoverData({
                      countryISO: d['Alpha-3 code-1'],
                      country: d['Country or Area'],
                      tradeType,
                      productGroup,
                      xPosition: event.clientX,
                      yPosition: event.clientY,
                    });
                  }}
                  onMouseLeave={() => {
                    setHoverData(undefined);
                  }}
                >
                  <circle
                    cx={0}
                    cy={0}
                    key={i}
                    fill='#fff'
                    stroke='#006EB5'
                    strokeWidth={2}
                    r={radius}
                  />
                  {
                    radius > 10 ? (
                      <>
                        <text
                          fontSize={radius > 18 ? 10 : 8}
                          x={0}
                          y={0}
                          dy={radius > 18 ? -3 : -1}
                          textAnchor='middle'
                        >
                          {d['Alpha-3 code-1']}
                        </text>
                        <text
                          fontSize={radius > 18 ? 10 : 8}
                          fontWeight='bold'
                          x={0}
                          y={0}
                          textAnchor='middle'
                          dy={radius > 18 ? 10 : 8}
                        >
                          {tradeType === 'Exports' ? format('$.2s')(d['Import (US$ Thousand)'] * 1000).replace('G', 'B') : format('$.2s')(d['Export (US$ Thousand)'] * 1000).replace('G', 'B')}
                        </text>
                      </>
                    ) : null
                  }
                </g>
              );
            })
          }
          <g
            transform={`translate(${UKRCenter[0]},${UKRCenter[1]})`}
          >
            <circle
              cx={0}
              cy={0}
              fill='#fff'
              stroke='#006EB5'
              strokeWidth={2}
              r={tradeType === 'Exports' ? radiusScale(sumBy(dataFiltered, (d) => d['Import (US$ Thousand)'])) : radiusScale(sumBy(dataFiltered, (d) => d['Export (US$ Thousand)']))}
            />
            <text
              fontSize={12}
              x={0}
              y={0}
              dy={-3}
              textAnchor='middle'
            >
              UKR
            </text>
            <text
              fontSize={10}
              fontWeight='bold'
              x={0}
              y={0}
              textAnchor='middle'
              dy={10}
            >
              {tradeType === 'Exports' ? format('$.2s')(sumBy(dataFiltered, (d) => d['Import (US$ Thousand)']) * 1000).replace('G', 'B') : format('$.2s')(sumBy(dataFiltered, (d) => d['Export (US$ Thousand)']) * 1000).replace('G', 'B')}
            </text>
          </g>
        </g>
      </svg>
      {
        hoverData ? <Tooltip data={hoverData} /> : null
      }
    </El>
  );
};
