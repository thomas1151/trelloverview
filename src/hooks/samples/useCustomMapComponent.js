import { React } from 'react';
const SampleUseCustomMapComponent = (key, renderFn, data) => (
    <React.Fragment>
        <div className="key">{key}</div>
        <div className="data">{JSON.stringify(data)}</div>
        <div className="renderFn">
            {renderFn(key, data)}
        </div>
    </React.Fragment>
)

export default SampleUseCustomMapComponent;
