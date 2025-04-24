/*
 *  Copyright (C) 1998-2025 by Northwoods Software Corporation. All Rights Reserved.
 */

import "./Inspector.css";

interface InspectorRowProps {
  id: string;
  value: string;
  onInputChange: (key: string, value: string, isBlur: boolean) => void;
}

export const InspectorRow = (props: InspectorRowProps) => {
  const handleInputChange = (e: any) => {
    props.onInputChange(props.id, e.target.value, e.type === "blur");
  };

  const formatLocation = (loc: string) => {
    const locArr = loc.split(" ");
    if (locArr.length === 2) {
      const x = parseFloat(locArr[0]);
      const y = parseFloat(locArr[1]);
      if (!isNaN(x) && !isNaN(y)) {
        return `${x.toFixed(0)} ${y.toFixed(0)}`;
      }
    }
    return loc;
  };

  return (
    <tr>
      <td>{props.id}</td>
      <td>
        <input
          disabled={props.id === "key"}
          value={props.id === "loc" ? formatLocation(props.value) : props.value}
          onChange={handleInputChange}
          onBlur={handleInputChange}
        ></input>
      </td>
    </tr>
  );
};
