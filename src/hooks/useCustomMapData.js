import React from 'react';

const defaultAdditionalProps = () => (undefined);

/**
 * Mapping hook which allows us to render a component (RenderC - controller) with the
 * view from RenderFn. additionalProps are given too, and these are unpacked and given to the renderComponent.
 * Once the render component has those props, it can do whatever it wants with it. Consume it, pass it to the renderFn (and call another Component (controller))
 * if needs be.
 * 
 *  @param {arr} data the data we're iterating over.
 *  @param {function} mapFn if we need to perform some kind of translation on the data before we map, here is the spot (we have this 'cuz it's a hook innit)
 *  @param {Component} RenderC the React component that is responsible for the logic, and controls the rendering.
 *  @param {function} RenderFn this is the view we pass to the component - our 'preference' for what we want the view to be - RenderC may not follow this (or may wrap etc)!
 *  @param {Object} additionalProps any props that the RenderC may want. It could then pass it to RenderFn or something.
 */
const useCustomMapData = (data, mapFn, RenderC, renderFn, additionalProps = defaultAdditionalProps) =>
    (mapFn(data).map((x) => (<RenderC key={x.id} renderFn={renderFn} data={x} {...additionalProps(x)} />)))

export default useCustomMapData;
