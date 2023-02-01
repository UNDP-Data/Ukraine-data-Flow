import {
  useEffect,
  useRef, useState,
} from 'react';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { scaleThreshold } from 'd3-scale';
import { select } from 'd3-selection';
import { Radio, Select } from 'antd';
import UKRCerealImportData from './Data/UkraineExports/AllCereals.json';
import RUSCerealImportData from './Data/RussiaExport/AllCereals.json';
import totalCerealImportData from './Data/TotalImports/AllCereal.json';
import UKRWheatImportData from './Data/UkraineExports/Wheat.json';
import RUSWheatImportData from './Data/RussiaExport/Wheat.json';
import totalWheatImportData from './Data/TotalImports/Wheat.json';
import UKRMaizeImportData from './Data/UkraineExports/Maize.json';
import RUSMaizeImportData from './Data/RussiaExport/Maize.json';
import totalMaizeImportData from './Data/TotalImports/Maize.json';
import UKRSunflowerImportData from './Data/UkraineExports/SunflowerSeeds.json';
import RUSSunflowerImportData from './Data/RussiaExport/SunflowerSeeds.json';
import totalSunflowerImportData from './Data/TotalImports/SunflowerSeeds.json';
import WorldMap from './Data/worldFull.json';
import { ChoroplethHoverDataType, DataType, ImportDataType } from './Types';
import { ChoroplethTooltip } from './ChoroplethTooltip';

const formatData = (total: ImportDataType[], ukr: ImportDataType[], rus: any) => {
  const dataMissing: string[] = [];
  ukr.forEach((d: { country: string; }) => {
    if (rus.findIndex((el: { country: any; }) => el.country === d.country) === -1) dataMissing.push(d.country);
  });
  const data: DataType[] = rus.map((d: any) => {
    const totalImp = total[total.findIndex((el: { country: any; }) => el.country === d.country)];
    const rusPercent2018 = totalImp['2018'] === 0 ? 0 : (d['2018'] * 100) / totalImp['2018'];
    const ukrValue2018 = ukr.findIndex((el: { country: any; }) => el.country === d.country) !== -1 ? ukr[ukr.findIndex((el: { country: any; }) => el.country === d.country)]['2018'] : 0;
    const rusPercent2019 = totalImp['2019'] === 0 ? 0 : (d['2019'] * 100) / totalImp['2019'];
    const ukrValue2019 = ukr.findIndex((el: { country: any; }) => el.country === d.country) !== -1 ? ukr[ukr.findIndex((el: { country: any; }) => el.country === d.country)]['2019'] : 0;
    const rusPercent2020 = totalImp['2020'] === 0 ? 0 : (d['2020'] * 100) / totalImp['2020'];
    const ukrValue2020 = ukr.findIndex((el: { country: any; }) => el.country === d.country) !== -1 ? ukr[ukr.findIndex((el: { country: any; }) => el.country === d.country)]['2020'] : 0;
    return {
      country: d.country,
      value: {
        2018: {
          rusValue: d['2018'],
          rusPercent: rusPercent2018,
          ukrValue: ukrValue2018,
          ukrPercent: totalImp['2018'] === 0 ? 0 : (ukrValue2018 * 100) / totalImp['2018'],
        },
        2019: {
          rusValue: d['2019'],
          rusPercent: rusPercent2019,
          ukrValue: ukrValue2019,
          ukrPercent: totalImp['2019'] === 0 ? 0 : (ukrValue2019 * 100) / totalImp['2019'],
        },
        2020: {
          rusValue: d['2020'],
          rusPercent: rusPercent2020,
          ukrValue: ukrValue2020,
          ukrPercent: totalImp['2020'] === 0 ? 0 : (ukrValue2020 * 100) / totalImp['2020'],
        },
      },
    };
  });

  dataMissing.forEach((d) => {
    const indx = ukr.findIndex((el: { country: string; }) => el.country === d);
    const totalImp = total[total.findIndex((el: { country: string; }) => el.country === d)];
    data.push({
      country: d,
      value: {
        2018: {
          rusValue: 0,
          rusPercent: 0,
          ukrValue: ukr[indx]['2018'],
          ukrPercent: totalImp['2018'] === 0 ? 0 : (ukr[indx]['2018'] * 100) / totalImp['2018'],
        },
        2019: {
          rusValue: 0,
          rusPercent: 0,
          ukrValue: ukr[indx]['2019'],
          ukrPercent: totalImp['2019'] === 0 ? 0 : (ukr[indx]['2019'] * 100) / totalImp['2019'],
        },
        2020: {
          rusValue: 0,
          rusPercent: 0,
          ukrValue: ukr[indx]['2020'],
          ukrPercent: totalImp['2020'] === 0 ? 0 : (ukr[indx]['2020'] * 100) / totalImp['2020'],
        },
      },
    });
  });

  return data;
};

export const ChoroplethMap = () => {
  const svgWidth = 960;
  const svgHeight = 565;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const [hoverData, setHoverData] = useState<ChoroplethHoverDataType | undefined>(undefined);
  const [productGroup, setProductGroup] = useState('Wheat and Meslin');
  const [country, setCountry] = useState('Both');
  const [year, setYear] = useState<'2018' | '2019' | '2020'>('2020');

  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  const projection = geoEqualEarth().rotate([0, 0]).scale(200).translate([450, 300]);

  const CerealData: DataType[] = formatData(totalCerealImportData, UKRCerealImportData, RUSCerealImportData);
  const MaizeData: DataType[] = formatData(totalMaizeImportData, UKRMaizeImportData, RUSMaizeImportData);
  const WheatData: DataType[] = formatData(totalWheatImportData, UKRWheatImportData, RUSWheatImportData);
  const SunflowerData: DataType[] = formatData(totalSunflowerImportData, UKRSunflowerImportData, RUSSunflowerImportData);

  const colorArray = ['#fafafa', '#ffffd9', '#e4f4cb', '#c4e6c3', '#9dd4c0', '#69c1c1', '#3ea2bd', '#347cab', '#265994', '#173978', '#081d58'];
  const domain = [0.0001, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const colorScale = scaleThreshold<number, string>().domain(domain).range(colorArray);
  const options = ['All Cereals', 'Wheat and Meslin', 'Maize or Corn', 'Sunflower seed, safflower or cotton-seed oil'];
  const data = productGroup === 'All Cereals' ? CerealData : productGroup === 'Wheat and Meslin' ? WheatData : productGroup === 'Maize or Corn' ? MaizeData : SunflowerData;

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
    <div>
      <div className='flex-div flex-space-between flex-wrap margin-bottom-05'>
        <div style={{ width: '25%', minWidth: '20rem' }}>
          <p className='label margin-bottom-05'>Select Item</p>
          <Select
            className='undp-select'
            showSearch
            value={productGroup}
            onChange={(d) => { setProductGroup(d); }}
          >
            {
              options.map((d) => (
                <Select.Option className='undp-select-option' key={d}>{d}</Select.Option>
              ))
            }
          </Select>
        </div>
        <div className='flex-div flex-wrap'>
          <div>
            <p className='label margin-bottom-05'>Select Year</p>
            <Radio.Group
              defaultValue='2020'
              onChange={(e) => { setYear(e.target.value); }}
            >
              <Radio className='undp-radio' value='2018'>2018</Radio>
              <Radio className='undp-radio' value='2019'>2019</Radio>
              <Radio className='undp-radio' value='2020'>2020</Radio>
            </Radio.Group>
          </div>
          <div>
            <p className='label margin-bottom-05'>Select Export Country</p>
            <Radio.Group
              defaultValue='Exports'
              onChange={(e) => { setCountry(e.target.value); }}
            >
              <Radio className='undp-radio' value='Both'>Imports from Both</Radio>
              <Radio className='undp-radio' value='Ukraine'>Imports from UKR</Radio>
              <Radio className='undp-radio' value='Russia'>Imports from RUS</Radio>
            </Radio.Group>
          </div>
        </div>
      </div>
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
                    value: data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME) !== -1 ? country === 'Both' ? (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].ukrValue + data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].rusValue) : country === 'Ukraine' ? (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].ukrValue) : (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].rusValue) : 0,
                    percent: data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME) !== -1 ? country === 'Both' ? (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].ukrPercent + data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].rusPercent) : country === 'Ukraine' ? (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].ukrPercent) : (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].rusPercent) : 0,
                    xPosition: event.clientX,
                    yPosition: event.clientY,
                    year,
                  });
                }}
                onMouseMove={(event) => {
                  setHoverData({
                    countryISO: d.properties.ISO3,
                    country: d.properties.NAME,
                    exporter: country,
                    value: data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME) !== -1 ? country === 'Both' ? (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].ukrValue + data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].rusValue) : country === 'Ukraine' ? (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].ukrValue) : (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].rusValue) : 0,
                    percent: data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME) !== -1 ? country === 'Both' ? (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].ukrPercent + data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].rusPercent) : country === 'Ukraine' ? (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].ukrPercent) : (data[data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME)].value[year].rusPercent) : 0,
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
                      const indx = data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME);
                      const color = indx === -1 ? '#fafafa' : country === 'Both' ? colorScale(data[indx].value[year].ukrPercent + data[indx].value[year].rusPercent) : country === 'Ukraine' ? colorScale(data[indx].value[year].ukrPercent) : colorScale(data[indx].value[year].rusPercent);
                      return (
                        <path
                          key={j}
                          d={masterPath}
                          stroke='#ddd'
                          strokeWidth={0.5}
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
                      const indx = data.findIndex((d1: { country: any; }) => d1.country === d.properties.NAME);
                      const color = indx === -1 ? '#fafafa' : country === 'Both' ? colorScale(data[indx].value[year].ukrPercent + data[indx].value[year].rusPercent) : country === 'Ukraine' ? colorScale(data[indx].value[year].ukrPercent) : colorScale(data[indx].value[year].rusPercent);
                      return (
                        <path
                          key={j}
                          d={path}
                          stroke='#ddd'
                          strokeWidth={0.5}
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
    </div>
  );
};
