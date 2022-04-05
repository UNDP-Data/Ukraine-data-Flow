export interface HoverDataType {
  countryISO: string;
  country: string;
  tradeType: string;
  productGroup: string;
  xPosition: number;
  yPosition: number;
}

export interface ChoroplethHoverDataType {
  countryISO: string;
  country: string;
  value: number;
  percent: number;
  xPosition: number;
  yPosition: number;
  productGroup: string;
  exporter: string;
  year: '2018' | '2019' | '2020';
}

export interface DataType {
  country: string;
  value: {
    '2018': {
      rusValue: number;
      rusPercent: number;
      ukrValue: number;
      ukrPercent: number;
    };
    '2019': {
      rusValue: number;
      rusPercent: number;
      ukrValue: number;
      ukrPercent: number;
    };
    '2020': {
      rusValue: 0;
      rusPercent: 0;
      ukrValue: number;
      ukrPercent: number;
    };
  }
}

export interface ImportDataType {
  country: string;
  '2017': number;
  '2018': number;
  '2019': number;
  '2020': number
}
