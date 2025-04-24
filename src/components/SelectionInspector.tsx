/*
 *  Copyright (C) 1998-2025 by Northwoods Software Corporation. All Rights Reserved.
 */

import { InspectorRow } from "./InspectorRow";

import "./Inspector.css";

interface SelectionInspectorProps {
  selectedData: any;
  onInputChange: (id: string, value: string, isBlur: boolean) => void;
}

export const SelectionInspector = (props: SelectionInspectorProps) => {
  /**
   * Render the object data, passing down property keys and values.
   */
  const renderObjectDetails = () => {
    const selObj = props.selectedData;
    const dets = [];
    for (const k in selObj) {
      const val = selObj[k];
      const row = <InspectorRow key={k} id={k} value={val} onInputChange={props.onInputChange} />;
      if (k === "key") {
        dets.unshift(row); // key always at start
      } else {
        dets.push(row);
      }
    }
    return dets;
  };

  return (
    <div id="myInspectorDiv" className="inspector">
      <table>
        <tbody>{renderObjectDetails()}</tbody>
      </table>
    </div>
  );
};
