import React from 'react';

const ToggleButton = () => {
    const onColor = "#059ed8";
    const offColor = "#343a40";

    const [isOn, setIsOn] = React.useState(true);
    const color = isOn ? onColor : offColor;
    const toggleIsOn = () => setIsOn(!isOn);

    return(
        <div style={ { background: color} }>
            <button onClick={toggleIsOn}></button>
        </div>

    )
}

export default ToggleButton; 