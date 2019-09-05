/*
*  Copyright (C) 1998-2019 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import * as React from 'react';

import './Diagram.css';

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramChange: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export class Diagram extends React.Component<DiagramProps, {}> {
  private divRef: React.RefObject<HTMLDivElement>;
  private changedSelectionListener: ((e: go.DiagramEvent) => void) | null = null;
  private modelChangedListener: ((e: go.ChangedEvent) => void) | null = null;

  constructor(props: DiagramProps) {
    super(props);
    this.divRef = React.createRef();
  }

  /**
   * Returns a reference to the GoJS diagram instance for this component.
   */
  public getDiagram(): go.Diagram | null {
    if (!this.divRef.current) return null;
    return go.Diagram.fromDiv(this.divRef.current);
  }

  /**
   * Initialize the diagram and add the required listeners.
   */
  public componentDidMount() {
    if (!this.divRef.current) return;
    const $ = go.GraphObject.make;
    const diagram =
      $(go.Diagram, this.divRef.current,  // create a Diagram for the DIV HTML element
        {
          'undoManager.isEnabled': true,  // enable undo & redo
          'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
          model: $(go.GraphLinksModel,
            {
              linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync
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
            })
        });

    // define a simple Node template
    diagram.nodeTemplate =
      $(go.Node, 'Auto',  // the Shape will go around the TextBlock
        new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, 'RoundedRectangle',
          {
            name: 'SHAPE', fill: 'white', strokeWidth: 0,
            // set the port properties:
            portId: '', fromLinkable: true, toLinkable: true, cursor: 'pointer'
          },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')),
        $(go.TextBlock,
          { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' },  // some room around the text
          new go.Binding('text').makeTwoWay()
        )
      );

    // relinking depends on modelData
    diagram.linkTemplate =
      $(go.Link,
        new go.Binding('relinkableFrom', 'canRelink').ofModel(),
        new go.Binding('relinkableTo', 'canRelink').ofModel(),
        $(go.Shape),
        $(go.Shape, { toArrow: 'Standard' })
      );

    // merge props into model to ensure a deep copy
    const model = diagram.model as go.GraphLinksModel;
    model.mergeNodeDataArray(this.props.nodeDataArray);
    model.mergeLinkDataArray(this.props.linkDataArray);
    model.modelData = this.props.modelData;

    // initialize listeners
    this.changedSelectionListener = (e: go.DiagramEvent) => {
      this.props.onDiagramChange(e);
    };
    this.modelChangedListener = (e: go.ChangedEvent) => {
      if (e.isTransactionFinished) {
        this.props.onModelChange(e.model!.toIncrementalData(e));
      }
    };
    diagram.addDiagramListener('ChangedSelection', this.changedSelectionListener);
    diagram.addModelChangedListener(this.modelChangedListener);
  }

  /**
   * Disassociate the diagram from the div and remove listeners.
   */
  public componentWillUnmount() {
    const diagram = this.getDiagram();
    if (diagram) {
      diagram.div = null;
      if (this.changedSelectionListener) diagram.removeDiagramListener('ChangedSelection', this.changedSelectionListener);
      if (this.modelChangedListener) diagram.removeModelChangedListener(this.modelChangedListener);
    }
  }

  /**
   * Determines whether component needs to update by comparing external state passed as props against the GoJS model.
   * @param nextProps
   * @param nextState
   */
  public shouldComponentUpdate(nextProps: DiagramProps, nextState: any) {
    if (nextProps.skipsDiagramUpdate) return false;
    // quick shallow compare
    if (nextProps.nodeDataArray === this.props.nodeDataArray &&
        nextProps.linkDataArray === this.props.linkDataArray &&
        nextProps.modelData === this.props.modelData) return false;
    // compare new props vs current props, since any changes to array items should be immutable
    if (nextProps.nodeDataArray.length !== this.props.nodeDataArray.length) return true;
    for (let i = 0; i < nextProps.nodeDataArray.length; i++) {
      const d1 = nextProps.nodeDataArray[i];
      const d2 = this.props.nodeDataArray[i];
      if (d1 !== d2) return true;
    }
    if (nextProps.linkDataArray.length !== this.props.linkDataArray.length) return true;
    for (let i = 0; i < nextProps.linkDataArray.length; i++) {
      const d1 = nextProps.linkDataArray[i];
      const d2 = this.props.linkDataArray[i];
      if (d1 !== d2) return true;
    }
    if (nextProps.modelData !== this.props.modelData) return true;
    return false;
  }

  /**
   * When the component updates, merge all data changes into the GoJS model to ensure everything stays in sync.
   * The model change listener is removed during this update since the data changes are already known by the parent.
   * @param prevProps
   * @param prevState
   */
  public componentDidUpdate(prevProps: DiagramProps, prevState: any) {
    const diagram = this.getDiagram();
    if (diagram) {
      const model = diagram.model as go.GraphLinksModel;
      // don't need model change listener while performing known data updates
      if (this.modelChangedListener) model.removeChangedListener(this.modelChangedListener);
      model.startTransaction('update data');
      model.mergeNodeDataArray(this.props.nodeDataArray);
      model.mergeLinkDataArray(this.props.linkDataArray);
      model.modelData = this.props.modelData;
      model.commitTransaction('update data');
      if (this.modelChangedListener) model.addChangedListener(this.modelChangedListener);
    }
  }

  public render() {
    return (<div ref={this.divRef} className='diagram-component'></div>);
  }
}
