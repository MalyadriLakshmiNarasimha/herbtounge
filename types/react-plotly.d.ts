declare module 'react-plotly.js' {
  import * as React from 'react';

  export interface PlotParams {
    data: any[];
    layout?: any;
    config?: any;
    frames?: any[];
    onInitialized?: (figure: any, graphDiv: any) => void;
    onUpdate?: (figure: any, graphDiv: any) => void;
    onPurge?: (graphDiv: any) => void;
    onError?: (error: Error) => void;
    revision?: any;
    style?: React.CSSProperties;
    className?: string;
    divId?: string;
    debug?: boolean;
  }

  export default class Plot extends React.Component<PlotParams> {}
}
