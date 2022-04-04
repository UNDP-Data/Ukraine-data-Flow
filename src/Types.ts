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
}
