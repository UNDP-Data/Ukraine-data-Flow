import { createGlobalStyle } from 'styled-components';
import { FlowMap } from './FlowMap';
import { ChoroplethMap } from './ChoroplethMap';
import { PetroChoroplethMap } from './PetroChoroplethMap';

const GlobalStyle = createGlobalStyle`
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

const App = () => (
  <div className='undp-container'>
    <GlobalStyle />
    <FlowMap />
  </div>
);

export const App1 = () => (
  <div className='undp-container'>
    <ChoroplethMap />
  </div>
);

export const App2 = () => (
  <div className='undp-container'>
    <PetroChoroplethMap />
  </div>
);

export default App;
