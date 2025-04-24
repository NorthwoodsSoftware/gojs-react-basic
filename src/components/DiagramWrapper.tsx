/*
 *  Copyright (C) 1998-2025 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as go from "gojs";
import { ReactDiagram } from "gojs-react";
import { useEffect, useRef } from "react";

import { GuidedDraggingTool } from "../GuidedDraggingTool";

import "./Diagram.css";

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export const DiagramWrapper = (props: DiagramProps) => {
  const diagramRef = useRef<ReactDiagram>(null);
  const diagramStyle = { backgroundColor: "#eee" };

  // add/remove listeners
  // only done on mount, not any time there's a change to props.onDiagramEvent
  useEffect(() => {
    if (diagramRef.current === null) return;
    const diagram = diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener("ChangedSelection", props.onDiagramEvent);
    }
    return () => {
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener("ChangedSelection", props.onDiagramEvent);
      }
    };
  }, []);

  const initDiagram = (): go.Diagram => {
    const diagram = new go.Diagram({
      "undoManager.isEnabled": true, // must be set to allow for model change listening
      // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
      "clickCreatingTool.archetypeNodeData": { text: "new node", color: "lightblue" },
      draggingTool: new GuidedDraggingTool(), // defined in GuidedDraggingTool.ts
      "draggingTool.horizontalGuidelineColor": "blue",
      "draggingTool.verticalGuidelineColor": "blue",
      "draggingTool.centerGuidelineColor": "green",
      "draggingTool.guidelineWidth": 1,
      layout: new go.ForceDirectedLayout(),
      model: new go.GraphLinksModel({
        linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        // positive keys for nodes
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
        // negative keys for links
        makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
          let k = data.key || -1;
          while (m.findLinkDataForKey(k)) k--;
          data.key = k;
          return k;
        }
        // NOTE: the above 'KeyFunction's are simplistic and loop over data to avoid key collisions,
        // they are not suitable for applications with lots of data
      })
    });

    // define a simple Node template
    diagram.nodeTemplate = new go.Node("Auto").bind("location", "loc", go.Point.parse, go.Point.stringify).add(
      new go.Shape("RoundedRectangle", {
        name: "SHAPE",
        fill: "white",
        strokeWidth: 0,
        // set the port properties:
        portId: "",
        fromLinkable: true,
        toLinkable: true,
        cursor: "pointer"
      }).bind("fill", "color"),
      new go.TextBlock({
        margin: 8,
        font: "400 .875rem Roboto, sans-serif",
        editable: true // some room around the text
      }).bind(new go.Binding("text").makeTwoWay())
    );

    // relinking depends on modelData
    diagram.linkTemplate = new go.Link()
      .bind(new go.Binding("relinkableFrom", "canRelink").ofModel())
      .bind(new go.Binding("relinkableTo", "canRelink").ofModel())
      .add(new go.Shape(), new go.Shape({ toArrow: "Standard" }));

    return diagram;
  };

  return (
    <ReactDiagram
      ref={diagramRef}
      divClassName="diagram-component"
      style={diagramStyle}
      initDiagram={initDiagram}
      nodeDataArray={props.nodeDataArray}
      linkDataArray={props.linkDataArray}
      modelData={props.modelData}
      onModelChange={props.onModelChange}
      skipsDiagramUpdate={props.skipsDiagramUpdate}
    />
  );
};
