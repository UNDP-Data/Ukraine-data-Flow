import { FlowMap } from './FlowMap';
import { ChoroplethMap } from './ChoroplethMap';
import { PetroChoroplethMap } from './PetroChoroplethMap';

const App = () => (
  <div className='undp-container'>
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
