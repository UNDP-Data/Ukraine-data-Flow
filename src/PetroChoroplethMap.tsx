import {
  useEffect,
  useRef, useState,
} from 'react';
import styled from 'styled-components';
import { geoEqualEarth } from 'd3-geo';
import { scaleThreshold } from 'd3-scale';
import { Radio, Select } from 'antd';
import { zoom } from 'd3-zoom';
import { select } from 'd3-selection';
import RUSPetroOilImportData from './Data/RussiaExport/CrudeOil.json';
import totalPetroOilImportData from './Data/TotalImports/CrudeOil.json';
import RUSPetroGasImportData from './Data/RussiaExport/PetroGas.json';
import totalPetroGasImportData from './Data/TotalImports/PetroGas.json';
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
  align-items: center;
  flex-wrap: wrap;
`;

const OptionTitle = styled.div`
  font-size: 1.4rem;
`;

const RightContainer = styled.div`
  display: flex;
  div:first-of-type{
    margin-right: 2rem;
  }
  @media (max-width: 1024px) {
    margin-top: 2rem;
  }
  @media (max-width: 700px) {
    flex-wrap: wrap;
  }

`;

export const PetroChoroplethMap = () => {
  const svgWidth = 960;
  const svgHeight = 565;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const [hoverData, setHoverData] = useState<ChoroplethHoverDataType | undefined>(undefined);
  const [productGroup, setProductGroup] = useState('Petroleum Oil, Crude');
  const [year, setYear] = useState<'2018' | '2019' | '2020'>('2020');

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const projection = geoEqualEarth().rotate([0, 0]).scale(200).translate([450, 300]);

  const PetroOilData = RUSPetroOilImportData.map((d) => {
    const totalImp2018 = totalPetroOilImportData[totalPetroOilImportData.findIndex((el) => el.country === d.country)]['2018'];
    const rusPercent2018 = totalImp2018 === 0 ? 0 : (d['2018'] * 100) / totalImp2018;
    const totalImp2019 = totalPetroOilImportData[totalPetroOilImportData.findIndex((el) => el.country === d.country)]['2019'];
    const rusPercent2019 = totalImp2019 === 0 ? 0 : (d['2019'] * 100) / totalImp2019;
    const totalImp2020 = totalPetroOilImportData[totalPetroOilImportData.findIndex((el) => el.country === d.country)]['2020'];
    const rusPercent2020 = totalImp2020 === 0 ? 0 : (d['2020'] * 100) / totalImp2020;
    return {
      country: d.country,
      value: {
        2018: {
          rusValue: d['2018'],
          rusPercent: rusPercent2018,
        },
        2019: {
          rusValue: d['2019'],
          rusPercent: rusPercent2019,
        },
        2020: {
          rusValue: d['2020'],
          rusPercent: rusPercent2020,
        },
      },
    };
  });
  const PetroGasData = RUSPetroGasImportData.map((d) => {
    const totalImp2018 = totalPetroGasImportData[totalPetroGasImportData.findIndex((el) => el.country === d.country)]['2018'];
    const rusPercent2018 = totalImp2018 === 0 ? 0 : (d['2018'] * 100) / totalImp2018;
    const totalImp2019 = totalPetroGasImportData[totalPetroGasImportData.findIndex((el) => el.country === d.country)]['2019'];
    const rusPercent2019 = totalImp2019 === 0 ? 0 : (d['2019'] * 100) / totalImp2019;
    const totalImp2020 = totalPetroGasImportData[totalPetroGasImportData.findIndex((el) => el.country === d.country)]['2020'];
    const rusPercent2020 = totalImp2020 === 0 ? 0 : (d['2020'] * 100) / totalImp2020;
    return {
      country: d.country,
      value: {
        2018: {
          rusValue: d['2018'],
          rusPercent: rusPercent2018,
        },
        2019: {
          rusValue: d['2019'],
          rusPercent: rusPercent2019,
        },
        2020: {
          rusValue: d['2020'],
          rusPercent: rusPercent2020,
        },
      },
    };
  });
  const colorArray = ['#fafafa', '#ffffd9', '#e4f4cb', '#c4e6c3', '#9dd4c0', '#69c1c1', '#3ea2bd', '#347cab', '#265994', '#173978', '#081d58'];
  const domain = [0.0001, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const colorScale = scaleThreshold<number, string>().domain(domain).range(colorArray);
  const options = ['Petroleum Oil, Crude', 'Petroleum Gas and Other Gaseous HydroCarbons'];
  const data = productGroup === 'Petroleum Oil, Crude' ? PetroOilData : PetroGasData;
  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent([0.8, 6])
      .translateExtent([[-20, 0], [svgWidth + 20, svgHeight]])
      .on('zoom', ({ transform }) => {
        mapGSelect.attr('transform', transform);
      });
    mapSvgSelect.call(zoomBehaviour as any);
  }, [svgHeight, svgWidth]);

  return (
    <El>
      <SelectEl>
        <div>
          <div>
            <OptionTitle>
              Select Item
            </OptionTitle>
          </div>
          <Select
            showSearch
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
        </div>
        <RightContainer>
          <div>
            <div>
              <OptionTitle>
                Select Year
              </OptionTitle>
            </div>
            <Radio.Group
              defaultValue='2020'
              buttonStyle='solid'
              size='middle'
              onChange={(e) => { setYear(e.target.value); }}
            >
              <Radio.Button value='2018'>2018</Radio.Button>
              <Radio.Button value='2019'>2019</Radio.Button>
              <Radio.Button value='2020'>2020</Radio.Button>
            </Radio.Group>
          </div>
        </RightContainer>
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
                    value: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].value[year].rusValue) : 0,
                    percent: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].value[year].rusPercent) : 0,
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                    year,
                  });
                }}
                onMouseMove={(event) => {
                  setHoverData({
                    countryISO: d.properties.ISO3,
                    country: d.properties.NAME,
                    exporter: 'Russia',
                    value: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].value[year].rusValue) : 0,
                    percent: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].value[year].rusPercent) : 0,
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                    productGroup,
                    year,
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
                      const color = indx === -1 ? '#fafafa' : colorScale(data[indx].value[year].rusPercent);
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          stroke='#ddd'
                          strokeWidth={0.5}
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
                      const color = indx === -1 ? '#fafafa' : colorScale(data[indx].value[year].rusPercent);
                      return (
                        <path
                          key={j}
                          d={path}
                          stroke='#ddd'
                          strokeWidth={0.5}
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
