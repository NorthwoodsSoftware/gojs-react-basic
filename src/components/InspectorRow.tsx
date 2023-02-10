/*
*  Copyright (C) 1998-2023 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as React from 'react';
import './Inspector.css';

interface InspectorRowProps {
  id: string;
  value: string;
  onInputChange: (key: string, value: string, isBlur: boolean) => void;
}

export class InspectorRow extends React.PureComponent<InspectorRowProps, {}> {
  constructor(props: InspectorRowProps) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  private handleInputChange(e: any) {
    this.props.onInputChange(this.props.id, e.target.value, e.type === 'blur');
  }

  private formatLocation(loc: string): string {
    const locArr = loc.split(' ');
    if (locArr.length === 2) {
      const x = parseFloat(locArr[0]);
      const y = parseFloat(locArr[1]);
      if (!isNaN(x) && !isNaN(y)) {
        return `${x.toFixed(0)} ${y.toFixed(0)}`;
      }
    }
    return loc;
  }

  public render() {
    let val = this.props.value;
    if (this.props.id === 'loc') {
      val = this.formatLocation(this.props.value);
    }
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>
          <input
            disabled={this.props.id === 'key'}
            value={val}
            onChange={this.handleInputChange}
            onBlur={this.handleInputChange}>
          </input>
        </td>
      </tr>
    );
  }
}
