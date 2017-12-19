import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';

import GraphView from 'react-digraph';
import GraphConfig from './graph-config.js'; // Configures node/edge types

import { AddNodeForm } from '../AddNodeForm';
import { Alert } from 'antd';

const styles = {  
  graph: {
    height: '100%',
    width: '100%'
  }
};

const NODE_KEY = "id" // Key used to identify nodes

// TODO: Some config
const THEME_TYPE = "theme";
const COURSE_TYPE = "course";
const SEMESTER_TYPE = "semester";
const YEAR_TYPE = "year";
const EMPTY_TYPE = "empty";

const NODE_TYPES = [
  THEME_TYPE,
  COURSE_TYPE,
  SEMESTER_TYPE,
  YEAR_TYPE,
  EMPTY_TYPE,
]
const SPECIAL_CHILD_SUBTYPE = "specialChild";
const EMPTY_EDGE_TYPE = "emptyEdge";
const SPECIAL_EDGE_TYPE = "specialEdge";

class Graph extends Component {

  constructor(props) {
    super(props);
    let graphForState = {
      "nodes": [],
      "edges": [],
    };

    this.state = {
      graph: graphForState,
      selected: {},
      createFormVisible: false,
      xOnAdd: 0,
      yOnAdd: 0,
    }
  }

  componentDidMount() {
    fetch('/graph.json')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      this.setState({ graph: data});
    })
    .catch( alert );
  }

  // Helper to find the index of a given node
  @autobind
  getNodeIndex(searchNode) {
    return this.state.graph.nodes.findIndex((node)=>{
      return node[NODE_KEY] === searchNode[NODE_KEY]
    })
  }

  // Helper to find the index of a given edge
  @autobind
  getEdgeIndex(searchEdge) {
    return this.state.graph.edges.findIndex((edge)=>{
      return edge.source === searchEdge.source &&
        edge.target === searchEdge.target
    })
  }

  // Given a nodeKey, return the corresponding node
  @autobind
  getViewNode(nodeKey) {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);
    return this.state.graph.nodes[i]
  }

  /*
   * Handlers/Interaction
   */

  // Called by 'drag' handler, etc.. 
  // to sync updates from D3 with the graph
  @autobind
  onUpdateNode(viewNode) {
    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
    this.setState({ graph: graph });
  }

  // Node 'mouseUp' handler
  @autobind
  onSelectNode(viewNode) {
    // Deselect events will send Null viewNode
    if (!!viewNode){
      this.setState({selected: viewNode});
    } else{
      this.setState({selected: {}});
    }
  }

  // Edge 'mouseUp' handler
  @autobind
  onSelectEdge(viewEdge) {
    this.setState({selected: viewEdge});
  }

  // Updates the graph with a new node
  @autobind
  onCreateNode(x,y) {
    const graph = this.state.graph;
    this.setState({ xOnAdd: x, yOnAdd: y });
    this.showModal();
  }

  // Deletes a node from the graph
  @autobind
  onDeleteNode(viewNode) {
    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);
    graph.nodes.splice(i, 1);

    // Delete any connected edges
    const newEdges = graph.edges.filter((edge, i)=>{
      return  edge.source != viewNode[NODE_KEY] && 
              edge.target != viewNode[NODE_KEY]
    })

    graph.edges = newEdges;

    this.setState({graph: graph, selected: {}});
  }

  // Creates a new node between two edges
  @autobind
  onCreateEdge(sourceViewNode, targetViewNode) {
    const graph = this.state.graph;

    // This is just an example - any sort of logic 
    // could be used here to determine edge type
    const type = sourceViewNode.type === NODE_TYPES.EMPTY_TYPE ? SPECIAL_EDGE_TYPE : EMPTY_EDGE_TYPE;

    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type: type
    }
    
    // Only add the edge when the source node is not the same as the target
    if (viewEdge.source !== viewEdge.target) {
      graph.edges.push(viewEdge);
      this.setState({graph: graph});
    }
  }

  // Called when an edge is reattached to a different target.
  @autobind
  onSwapEdge(sourceViewNode, targetViewNode, viewEdge) {
    const graph = this.state.graph;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;

    this.setState({graph: graph});
  }

  // Called when an edge is deleted
  @autobind
  onDeleteEdge(viewEdge) {
    const graph = this.state.graph;
    const i = this.getEdgeIndex(viewEdge);
    graph.edges.splice(i, 1);
    this.setState({graph: graph, selected: {}});
  }

  @autobind
  handleCancel() {
    this.setState({ createFormVisible: false });
  }

  @autobind
  showModal() {
    this.setState({ createFormVisible: true });
  }

  @autobind
  saveFormRef(form) {
    this.form = form;
  }

  @autobind
  handleCreate() {
    const form = this.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);

      const graph = this.state.graph;

      const viewNode = {
        id: this.state.graph.nodes.length + 1,
        title: values.title,
        type: values.type,
        x: this.state.xOnAdd,
        y: this.state.yOnAdd,
      }
  
      graph.nodes.push(viewNode);

      form.resetFields();
      this.setState({ graph: graph });
      this.setState({ createFormVisible: false });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.allNodesQuery && nextProps.allNodesQuery.loading) {
      return;
    }

    if (nextProps.allNodesQuery && nextProps.allNodesQuery.error) {
      return;
    }
    this.setState({ graph: {
      nodes: nextProps.allNodesQuery.allNodes.map((node) => {
        return Object.assign({}, node);
      }),
      edges: [],
    }})
  }

  /*
   * Render
   */

  render() {

    if (this.props.allNodesQuery && this.props.allNodesQuery.loading) {
      return <div id='graph' style={styles.graph}> Loading</div>
    }

    if (this.props.allNodesQuery && this.props.allNodesQuery.error) {
      return <div id='graph' style={styles.graph}>Error</div>
    }

    const nodes = this.state.graph.nodes;
    const edges = this.state.graph.edges;
    const selected = this.state.selected;

    const NodeTypes = GraphConfig.NodeTypes;
    const NodeSubtypes = GraphConfig.NodeSubtypes;
    const EdgeTypes = GraphConfig.EdgeTypes;

    return (
      <div id='graph' style={styles.graph}>
        {this.state.selected && this.state.selected.hasOwnProperty('title') ?
          <Alert message={this.state.selected.title} type="success" />
          :
          null
        }
        <AddNodeForm
          ref={this.saveFormRef}
          visible={this.state.createFormVisible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          types={NODE_TYPES}
        />
      
        <GraphView  ref={(el) => this.GraphView = el}
                    nodeKey={NODE_KEY}
                    emptyType={EMPTY_TYPE}
                    nodes={nodes}
                    edges={edges}
                    selected={selected}
                    nodeTypes={NodeTypes}
                    nodeSubtypes={NodeSubtypes}
                    edgeTypes={EdgeTypes}
                    getViewNode={this.getViewNode}
                    onSelectNode={this.onSelectNode}
                    onCreateNode={this.onCreateNode}
                    onUpdateNode={this.onUpdateNode}
                    onDeleteNode={this.onDeleteNode}
                    onSelectEdge={this.onSelectEdge}
                    onCreateEdge={this.onCreateEdge}
                    onSwapEdge={this.onSwapEdge}
                    onDeleteEdge={this.onDeleteEdge}/>
      </div>
    );
  }
}
// old implementation without basic data
// const ALL_NODES_QUERY = gql`
//   query AllNodesQuery {
//     allNodes {
//       id
//       title
//       x
//       y
//       type
//     }
//   }
// `

// export default graphql(
//   ALL_NODES_QUERY,
//   { name: 'allNodesQuery' }
// )(Graph);
export default Graph;