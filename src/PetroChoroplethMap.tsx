import {
  useRef, useState,
} from 'react';
import styled from 'styled-components';
import { geoEqualEarth } from 'd3-geo';
import { scaleThreshold } from 'd3-scale';
import { Select } from 'antd';
import RUSPetroOilImportData from './Data/rusPetroOilExport.json';
import totalPetroOilImportData from './Data/totalPetroOilImportData.json';
import RUSPetroGasImportData from './Data/rusPetroGasExport.json';
import totalPetroGasImportData from './Data/totalPetroGasImportData.json';
import WorldMap from './Data/worldFull.json';
import 'antd/dist/antd.css';
import { ChoroplethHoverDataType } from './Types';
import { ChoroplethTooltip } from './ChoroplethTooltip';

const El = styled.div`
  width: 100%;
`;

const SelectEl = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const PetroChoroplethMap = () => {
  const svgWidth = 960;
  const svgHeight = 565;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const [hoverData, setHoverData] = useState<ChoroplethHoverDataType | undefined>(undefined);
  const [productGroup, setProductGroup] = useState('Petroleaum Oil, Crude');

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const projection = geoEqualEarth().rotate([0, 0]).scale(200).translate([450, 300]);

  const PetroOilData = RUSPetroOilImportData.map((d) => {
    const totalImp = totalPetroOilImportData[totalPetroOilImportData.findIndex((el) => el.country === d.country)].value;
    const rusPercent = (d.value * 100) / totalImp;
    return {
      country: d.country,
      rusValue: d.value,
      rusPercent,
    };
  });
  const PetroGasData = RUSPetroGasImportData.map((d) => {
    const totalImp = totalPetroGasImportData[totalPetroGasImportData.findIndex((el) => el.country === d.country)].value;
    const rusPercent = (d.value * 100) / totalImp;
    return {
      country: d.country,
      rusValue: d.value,
      rusPercent,
    };
  });
  const colorArray = ['#fafafa', '#ffffd9', '#e4f4cb', '#c4e6c3', '#9dd4c0', '#69c1c1', '#3ea2bd', '#347cab', '#265994', '#173978', '#081d58'];
  const domain = [0.0001, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const colorScale = scaleThreshold<number, string>().domain(domain).range(colorArray);
  const options = ['Petroleaum Oil, Crude', 'Petroleum Gas and Other Gaseous HydroCarbons'];
  const data = productGroup === 'Petroleaum Oil, Crude' ? PetroOilData : PetroGasData;
  return (
    <El>
      <SelectEl>
        <Select
          showSearch
          style={
          {
            fontSize: '1.6rem',
            fontWeight: 'bold',
            minWidth: '25%',
            marginRight: '2rem',
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
      </SelectEl>
      <svg width='100%' viewBox={`0 0 ${svgWidth} ${svgHeight}`} ref={mapSvg}>
        <g ref={mapG}>
          {
            (WorldMap as any).features.map((d: any, i: number) => (
              <g
                key={i}
                opacity={hoverData ? hoverData.countryISO === d.properties.ISO3 ? 1 : 0.2 : 1}
                onMouseEnter={(event) => {
                  setHoverData({
                    countryISO: d.properties.ISO3,
                    country: d.properties.NAME,
                    productGroup,
                    exporter: 'Russia',
                    value: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusValue) : 0,
                    percent: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusPercent) : 0,
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                  });
                }}
                onMouseMove={(event) => {
                  setHoverData({
                    countryISO: d.properties.ISO3,
                    country: d.properties.NAME,
                    exporter: 'Russia',
                    value: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusValue) : 0,
                    percent: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusPercent) : 0,
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                    productGroup,
                  });
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
                      const indx = data.findIndex((d1) => d1.country === d.properties.NAME);
                      const color = indx === -1 ? '#fafafa' : colorScale(data[indx].rusPercent);
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          stroke='#ddd'
                          strokeWidth={1}
                          strokeOpacity={0.5}
                          opacity={!selectedColor ? 1 : selectedColor === color ? 1 : 0.1}
                          fill={d.properties.ISO3 !== 'RUS' ? color : 'rgb(24, 144, 255)'}
                        />
                      );
                    }) : d.geometry.coordinates.map((el:any, j: number) => {
                      let path = 'M';
                      el.forEach((c: number[], k: number) => {
                        const point = projection([c[0], c[1]]) as [number, number];
                        if (k !== el.length - 1) path = `${path}${point[0]} ${point[1]}L`;
                        else path = `${path}${point[0]} ${point[1]}`;
                      });
                      const indx = data.findIndex((d1) => d1.country === d.properties.NAME);
                      const color = indx === -1 ? '#fafafa' : colorScale(data[indx].rusPercent);
                      return (
                        <path
                          key={j}
                          d={path}
                          stroke='#ddd'
                          strokeWidth={1}
                          strokeOpacity={0.5}
                          opacity={!selectedColor ? 1 : selectedColor === color ? 1 : 0.1}
                          fill={d.properties.ISO3 !== 'RUS' ? color : 'rgb(24, 144, 255)'}
                        />
                      );
                    })
                  }
              </g>
            ))
          }
        </g>
        <g transform='translate(10, 525)'>
          <text
            x={0}
            y={0}
            fontSize={11}
            fill='#212121'
            fontWeight='bold'
            dy={-7}
          >
            Russia&apos;s
            {' '}
            Share of Import in the Country (%)
          </text>

          {
            domain.map((d, i) => (
              <g
                key={i}
                onMouseOver={() => { if (colorArray[i] !== '#fafafa') setSelectedColor(colorArray[i]); }}
                onMouseLeave={() => { setSelectedColor(undefined); }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={((i - 1) * 320) / colorArray.length + 1 + 40}
                  y={1}
                  width={(320 / colorArray.length) - 2}
                  height={8}
                  fill={colorArray[i]}
                  stroke={selectedColor === colorArray[i] ? '#212121' : colorArray[i]}
                />
                <text
                  x={((i) * 320) / colorArray.length + 40}
                  y={20}
                  textAnchor='middle'
                  fontSize={10}
                  fill='#212121'
                  opacity={i === 0 ? 0 : 1}
                >
                  {d}
                </text>
              </g>
            ))
          }
          <rect
            x={(((domain.length - 1) * 320) / colorArray.length) + 1 + 40}
            y={1}
            width={(320 / colorArray.length) - 2}
            height={8}
            fill={colorArray[domain.length]}
            stroke={selectedColor === colorArray[domain.length] ? '#212121' : colorArray[domain.length]}
            strokeWidth={1}
            style={{ cursor: 'pointer' }}
            onMouseOver={() => { setSelectedColor(colorArray[domain.length]); }}
            onMouseLeave={() => { setSelectedColor(undefined); }}
          />
          <rect
            x={0}
            y={1}
            width={(320 / colorArray.length) - 2}
            height={8}
            fill='#F1F1F1'
            stroke='#999'
            strokeWidth={1}
          />
          <text
            x={0 + (((320 / colorArray.length) - 2) / 2)}
            y={20}
            textAnchor='middle'
            fontSize={10}
            fill='#212121'
          >
            0
          </text>
        </g>
      </svg>
      {
        hoverData ? <ChoroplethTooltip data={hoverData} /> : null
      }
    </El>
  );
};
