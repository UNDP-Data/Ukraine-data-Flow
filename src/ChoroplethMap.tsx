import {
  useRef, useState,
} from 'react';
import styled from 'styled-components';
import { geoEqualEarth } from 'd3-geo';
import { scaleThreshold } from 'd3-scale';
import { Radio, Select } from 'antd';
import UKRCerealImportData from './Data/ukrCerealExport.json';
import RUSCerealImportData from './Data/rusCerealExport.json';
import totalCerealImportData from './Data/totalCerealImportData.json';
import UKRWheatImportData from './Data/ukrWheatExport.json';
import RUSWheatImportData from './Data/rusWheatExport.json';
import totalWheatImportData from './Data/totalWheatImportData.json';
import UKRMaizeImportData from './Data/ukrMaizeExport.json';
import RUSMaizeImportData from './Data/rusMaizeExport.json';
import totalMaizeImportData from './Data/totalMaizeImportData.json';
import UKRSunflowerImportData from './Data/ukrSunflowerExport.json';
import RUSSunflowerImportData from './Data/rusSunflowerExport.json';
import totalSunflowerImportData from './Data/totalSunflowerImportData.json';
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

export const ChoroplethMap = () => {
  const svgWidth = 960;
  const svgHeight = 565;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const [hoverData, setHoverData] = useState<ChoroplethHoverDataType | undefined>(undefined);
  const [productGroup, setProductGroup] = useState('All Cereals');
  const [country, setCountry] = useState('Both');

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const projection = geoEqualEarth().rotate([0, 0]).scale(200).translate([450, 300]);

  const CerealDataMissing: string[] = [];
  UKRCerealImportData.forEach((d) => {
    if (RUSCerealImportData.findIndex((el) => el.country === d.country) === -1) CerealDataMissing.push(d.country);
  });
  const CerealData = RUSCerealImportData.map((d) => {
    const totalImp = totalCerealImportData[totalCerealImportData.findIndex((el) => el.country === d.country)].value;
    const rusPercent = (d.value * 100) / totalImp;
    const ukrValue = UKRCerealImportData.findIndex((el) => el.country === d.country) !== -1 ? UKRCerealImportData[UKRCerealImportData.findIndex((el) => el.country === d.country)].value : 0;
    return {
      country: d.country,
      rusValue: d.value,
      ukrValue,
      rusPercent,
      ukrPercent: (ukrValue * 100) / totalImp,
    };
  });

  CerealDataMissing.forEach((d) => {
    const indx = UKRCerealImportData.findIndex((el) => el.country === d);
    const totalImp = totalCerealImportData[totalCerealImportData.findIndex((el) => el.country === d)].value;
    CerealData.push({
      country: d,
      rusValue: 0,
      ukrValue: UKRCerealImportData[indx].value,
      rusPercent: 0,
      ukrPercent: (UKRCerealImportData[indx].value * 100) / totalImp,
    });
  });

  const MaizeDataMissing: string[] = [];
  UKRMaizeImportData.forEach((d) => {
    if (RUSMaizeImportData.findIndex((el) => el.country === d.country) === -1) MaizeDataMissing.push(d.country);
  });
  const MaizeData = RUSMaizeImportData.map((d) => {
    const totalImp = totalMaizeImportData[totalMaizeImportData.findIndex((el) => el.country === d.country)].value;
    const rusPercent = (d.value * 100) / totalImp;
    const ukrValue = UKRMaizeImportData.findIndex((el) => el.country === d.country) !== -1 ? UKRMaizeImportData[UKRMaizeImportData.findIndex((el) => el.country === d.country)].value : 0;
    return {
      country: d.country,
      rusValue: d.value,
      ukrValue,
      rusPercent,
      ukrPercent: (ukrValue * 100) / totalImp,
    };
  });

  MaizeDataMissing.forEach((d) => {
    const indx = UKRMaizeImportData.findIndex((el) => el.country === d);
    const totalImp = totalMaizeImportData[totalMaizeImportData.findIndex((el) => el.country === d)].value;
    MaizeData.push({
      country: d,
      rusValue: 0,
      ukrValue: UKRMaizeImportData[indx].value,
      rusPercent: 0,
      ukrPercent: (UKRMaizeImportData[indx].value * 100) / totalImp,
    });
  });

  const WheatDataMissing: string[] = [];
  UKRWheatImportData.forEach((d) => {
    if (RUSWheatImportData.findIndex((el) => el.country === d.country) === -1) WheatDataMissing.push(d.country);
  });
  const WheatData = RUSWheatImportData.map((d) => {
    const totalImp = totalWheatImportData[totalWheatImportData.findIndex((el) => el.country === d.country)].value;
    const rusPercent = (d.value * 100) / totalImp;
    const ukrValue = UKRWheatImportData.findIndex((el) => el.country === d.country) !== -1 ? UKRWheatImportData[UKRWheatImportData.findIndex((el) => el.country === d.country)].value : 0;
    return {
      country: d.country,
      rusValue: d.value,
      ukrValue,
      rusPercent,
      ukrPercent: (ukrValue * 100) / totalImp,
    };
  });

  WheatDataMissing.forEach((d) => {
    const indx = UKRWheatImportData.findIndex((el) => el.country === d);
    const totalImp = totalWheatImportData[totalWheatImportData.findIndex((el) => el.country === d)].value;
    WheatData.push({
      country: d,
      rusValue: 0,
      ukrValue: UKRWheatImportData[indx].value,
      rusPercent: 0,
      ukrPercent: (UKRWheatImportData[indx].value * 100) / totalImp,
    });
  });

  const SunflowerDataMissing: string[] = [];
  UKRSunflowerImportData.forEach((d) => {
    if (RUSSunflowerImportData.findIndex((el) => el.country === d.country) === -1) SunflowerDataMissing.push(d.country);
  });
  const SunflowerData = RUSSunflowerImportData.map((d) => {
    const totalImp = totalSunflowerImportData[totalSunflowerImportData.findIndex((el) => el.country === d.country)].value;
    const rusPercent = (d.value * 100) / totalImp;
    const ukrValue = UKRSunflowerImportData.findIndex((el) => el.country === d.country) !== -1 ? UKRSunflowerImportData[UKRSunflowerImportData.findIndex((el) => el.country === d.country)].value : 0;
    return {
      country: d.country,
      rusValue: d.value,
      ukrValue,
      rusPercent,
      ukrPercent: (ukrValue * 100) / totalImp,
    };
  });

  SunflowerDataMissing.forEach((d) => {
    const indx = UKRSunflowerImportData.findIndex((el) => el.country === d);
    const totalImp = totalSunflowerImportData[totalSunflowerImportData.findIndex((el) => el.country === d)].value;
    SunflowerData.push({
      country: d,
      rusValue: 0,
      ukrValue: UKRSunflowerImportData[indx].value,
      rusPercent: 0,
      ukrPercent: (UKRSunflowerImportData[indx].value * 100) / totalImp,
    });
  });

  const colorArray = ['#fafafa', '#ffffd9', '#e4f4cb', '#c4e6c3', '#9dd4c0', '#69c1c1', '#3ea2bd', '#347cab', '#265994', '#173978', '#081d58'];
  const domain = [0.0001, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const colorScale = scaleThreshold<number, string>().domain(domain).range(colorArray);
  const options = ['All Cereals', 'Wheat and Meslin', 'Maize or Corn', 'Sunflower seed, safflower or cotton-seed oil'];
  const data = productGroup === 'All Cereals' ? CerealData : productGroup === 'Wheat and Meslin' ? WheatData : productGroup === 'Maize or Corn' ? MaizeData : SunflowerData;
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
        <Radio.Group
          defaultValue='Both'
          buttonStyle='solid'
          size='middle'
          onChange={(e) => { setCountry(e.target.value); }}
        >
          <Radio.Button value='Both'>Imports from Both</Radio.Button>
          <Radio.Button value='Ukraine'>Imports from Ukraine</Radio.Button>
          <Radio.Button value='Russia'>Imports from Russia</Radio.Button>
        </Radio.Group>
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
                    exporter: country,
                    value: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? country === 'Both' ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].ukrValue + data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusValue) : country === 'Ukraine' ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].ukrValue) : (data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusValue) : 0,
                    percent: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? country === 'Both' ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].ukrPercent + data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusPercent) : country === 'Ukraine' ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].ukrPercent) : (data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusPercent) : 0,
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                  });
                }}
                onMouseMove={(event) => {
                  setHoverData({
                    countryISO: d.properties.ISO3,
                    country: d.properties.NAME,
                    exporter: country,
                    value: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? country === 'Both' ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].ukrValue + data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusValue) : country === 'Ukraine' ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].ukrValue) : (data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusValue) : 0,
                    percent: data.findIndex((d1) => d1.country === d.properties.NAME) !== -1 ? country === 'Both' ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].ukrPercent + data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusPercent) : country === 'Ukraine' ? (data[data.findIndex((d1) => d1.country === d.properties.NAME)].ukrPercent) : (data[data.findIndex((d1) => d1.country === d.properties.NAME)].rusPercent) : 0,
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
                      const color = indx === -1 ? '#fafafa' : country === 'Both' ? colorScale(data[indx].ukrPercent + data[indx].rusPercent) : country === 'Ukraine' ? colorScale(data[indx].ukrPercent) : colorScale(data[indx].rusPercent);
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          stroke='#ddd'
                          strokeWidth={1}
                          strokeOpacity={0.5}
                          opacity={!selectedColor ? 1 : selectedColor === color ? 1 : 0.1}
                          fill={country === 'Ukraine' ? d.properties.ISO3 !== 'UKR' ? color : 'rgb(24, 144, 255)' : country === 'Russia' ? d.properties.ISO3 !== 'RUS' ? color : 'rgb(24, 144, 255)' : d.properties.ISO3 !== 'RUS' && d.properties.ISO3 !== 'UKR' ? color : 'rgb(24, 144, 255)'}
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
                      const color = indx === -1 ? '#fafafa' : country === 'Both' ? colorScale(data[indx].ukrPercent + data[indx].rusPercent) : country === 'Ukraine' ? colorScale(data[indx].ukrPercent) : colorScale(data[indx].rusPercent);
                      return (
                        <path
                          key={j}
                          d={path}
                          stroke='#ddd'
                          strokeWidth={1}
                          strokeOpacity={0.5}
                          opacity={!selectedColor ? 1 : selectedColor === color ? 1 : 0.1}
                          fill={country === 'Ukraine' ? d.properties.ISO3 !== 'UKR' ? color : 'rgb(24, 144, 255)' : country === 'Russia' ? d.properties.ISO3 !== 'RUS' ? color : 'rgb(24, 144, 255)' : d.properties.ISO3 !== 'RUS' && d.properties.ISO3 !== 'UKR' ? color : 'rgb(24, 144, 255)'}
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
            {country === 'Both' ? "Ukraine's and Russia's" : `${country}'s`}
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
