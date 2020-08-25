import React, { ReactNode } from 'react';

export interface ChildrenProps {
  children: ReactNode;
  location: {
    pathname: string
  };
  route: {
    routes: {
      tab_title: string;
      path: string;
      exact: boolean;
    }[]
  }
}

export default (props: ChildrenProps) => {
  return (
    <div>
      {props.children}
    </div>
  )
}
