import React from 'react';
const SampleUseCustomMapComponent = (props) => (
    <React.Fragment>
        <div className="key">{props.key}</div>,
        <div className="data">{JSON.stringify(props.data)}</div>,
        <div className="renderFn">
            {props.renderFn(props.key, props.data)}
        </div>
    </React.Fragment>
)

export default SampleUseCustomMapComponent;
