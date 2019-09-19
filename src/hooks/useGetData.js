import React from 'react';
import useCustomMapData from "./useCustomMapData";
import Loading from '../render/loading';

const defaultMapFn = (arr) => (arr)
const DefaultComponent = (props) => (<div>{props.renderFn(props.data)}</div>)
const defaultRenderFn = (x) => <div className={"id-"+x.id}>{x.id}</div>;
export default function useGetData(error, isLoading, data, renderComponent = DefaultComponent, renderFn = defaultRenderFn, mapFn = defaultMapFn, additionalProps) {
    const customMapData = useCustomMapData(data, mapFn, renderComponent, renderFn, additionalProps);

    return (
        error ?
            error.toString()
            :
            (isLoading ?
                <Loading />
                :
                <React.Fragment>
                    {customMapData}
                </React.Fragment>
            )
    );
}
