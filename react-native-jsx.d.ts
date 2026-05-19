import * as React from 'react';

declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> { }
    interface ElementClass extends React.Component<any, any> {
      render(): React.ReactNode;
    }
  }
}
