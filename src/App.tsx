import styled, { createGlobalStyle } from 'styled-components';
import { FlowMap } from './FlowMap';
import { ChoroplethMap } from './ChoroplethMap';
import { PetroChoroplethMap } from './PetroChoroplethMap';

const GlobalStyle = createGlobalStyle`
  :root {
    --white: #FFFFFF;
    --primary-blue: #006EB5;
    --blue-medium: #4F95DD;
    --blue-bg: #94C4F5;
    --navy: #082753;
    --black-100: #FAFAFA;
    --black-200: #f5f9fe;
    --black-300: #EDEFF0;
    --black-400: #E9ECF6;
    --black-450: #DDD;
    --black-500: #A9B1B7;
    --black-550: #666666;
    --black-600: #212121;
    --black-700: #000000;
    --blue-very-light: #F2F7FF;
    --yellow: #FBC412;
    --yellow-bg: #FFE17E;
    --red: #D12800;
    --red-bg: #FFBCB7;
    --shadow:0px 10px 30px -10px rgb(9 105 250 / 15%);
    --shadow-bottom: 0 10px 13px -3px rgb(9 105 250 / 5%);
    --shadow-top: 0 -10px 13px -3px rgb(9 105 250 / 15%);
    --shadow-right: 10px 0px 13px -3px rgb(9 105 250 / 5%);
    --shadow-left: -10px 0px 13px -3px rgb(9 105 250 / 15%);
  }
  
  html { 
    font-size: 62.5%; 
  }

  body {
    font-family: "proxima-nova", "Helvetica Neue", "sans-serif";
    color: var(--black-600);
    background-color: var(--white);
    margin: 0;
    padding: 0 2rem;
    font-size: 1.6rem;
    font-weight: 500;
    line-height: 2.56rem;
  }

  a {
    text-decoration: none;
    color: var(--primary-blue);
  }

  h3 {
    color: var(--navy);
    font-size: 3.2rem;
    font-weight: 700;
  }

  button.secondary {
    padding: 2rem;
    border-radius: 0.2rem;
    font-size: 1.4rem;
    font-weight: 700;
    background-color: var(--blue-very-light);
    color: var(--navy);
    border: 0;
    text-transform: uppercase;
    margin: 0 1rem;
    cursor: pointer;
    border-radius: 100px;
    padding: 1rem 3rem;
    &:hover {
      background: #B6D3FE;
    }
    &:active{
      background: #84B5FD;
    }
  }

  button.tertiary {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--primary-blue);
    border: 0;
    text-transform: uppercase;
    background-color: transparent;
    cursor: pointer;
    text-decoration: underline;
    &:hover {
      color: var(--navy);
    }
    &:active{
      color: var(--navy);
    }
  }

  a:hover {
    font-weight: bold;
  }

  .bold{
    font-weight: 700;
  }
  
  .italics{
    font-style: italic;
  }

  .ant-select-item-option-content {
    white-space: normal;
  }

  .ant-select-selector {
    border-radius: 0.5rem !important;
    background-color: var(--blue-very-light) !important;
    border: 1px solid var(--primary-blue) !important;
    color: var(--primary-blue) !important;
  }

  .ant-select-selection-item{
    font-size: 2rem !important;
    font-weight: 'medium';
  }
  @-webkit-keyframes dash {
    to {
      stroke-dashoffset: 1000;
    }
  }

  .path {
    -webkit-animation: dash 30s linear infinite;
    stroke-dasharray: 10,1;
  }

`;

const VizAreaEl = styled.div`
  display: flex;
  max-width: 1220px;
  align-items: center;
  justify-content: center;
`;

const App = () => (
  <>
    <GlobalStyle />
    <VizAreaEl>
      <FlowMap />
    </VizAreaEl>
  </>
);

export const App1 = () => (
  <>
    <GlobalStyle />
    <VizAreaEl>
      <ChoroplethMap />
    </VizAreaEl>
  </>
);

export const App2 = () => (
  <>
    <GlobalStyle />
    <VizAreaEl>
      <PetroChoroplethMap />
    </VizAreaEl>
  </>
);

export default App;
