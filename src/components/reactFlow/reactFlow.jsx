import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { useDrop } from "react-dnd";
import { toast } from "react-toastify";
import Navbar from "../navbar/navbar";
import "./reactFlow.scss";
import "reactflow/dist/style.css";
import TextUpdaterNode from "./textUpdaterNode";
import CustomEdge from "./customEdge";
import RightSideItem from "./dragComponent";
import { ItemTypes } from "../../constants/constants";
import ChangeLabel from "./changeLabel";

function ReactFlowComponent() {
  const [nodeId, setNodeId] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [text, setText] = useState("");
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const edgeTypes = useMemo(() => ({ "custom-edge": CustomEdge }), []);
  const addNodeRef = useRef(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const nodeTypes = useMemo(
    () => ({
      textUpdater: (props) => (
        <TextUpdaterNode {...props} onClick={drawerOpener} text={text} />
      ),
    }),
    []
  );

  const getItemsFromLocalStorage = (key) =>
    JSON.parse(localStorage.getItem(key) || "[]");

  useEffect(() => {
    setNodes(getItemsFromLocalStorage("nodes"));
    setEdges(getItemsFromLocalStorage("edges"));
    localStorage.removeItem("nodeId");
  }, []);

  const drawerOpener = useCallback((id) => {
    if (localStorage.getItem("nodeId")) return;
    localStorage.setItem("nodeId", id);
    setNodeId(id);
    setIsDrawerOpen(true);
  }, []);

  const updateLabelOfNode = useCallback(
    (id, text) => {
      setNodes((prevNodes) => {
        const updatedNodes = prevNodes.map((node) => {
          if (node.id === id) {
            return { ...node, data: { label: text } };
          }
          return node;
        });
        return updatedNodes;
      });
    },
    [setNodes]
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (connection) => {
      if (edges.some((edge) => edge.source === connection.source)) {
        toast.error(
          `Source node ${connection.source} already has an outgoing edge.`
        );
        return;
      }
      const edge = { ...connection, type: "custom-edge" };
      setEdges((eds) => addEdge(edge, eds));
    },
    [edges]
  );

  const handleDrop = useCallback(
    (id, clientOffset) => {
      if (!clientOffset) return toast.error("Client offset is null");
      const containerRect = document
        .querySelector(".flow-content")
        .getBoundingClientRect();
      const newPosition = {
        x: clientOffset.x - containerRect.left,
        y: clientOffset.y - containerRect.top,
      };
      setNodes((prevNodes) => [
        ...prevNodes,
        {
          id: `node-${nodes.length + 1}`,
          type: "textUpdater",
          position: newPosition,
          data: { label: id },
        },
      ]);
    },
    [nodes.length]
  );

  return (
    <>
      <Navbar nodes={nodes} edges={edges} />
      <div className="main-content w-100 d-flex flex-row">
        <div
          className="flow-content w-75"
          ref={
            useDrop({
              accept: ItemTypes.NODE,
              drop: (item, monitor) =>
                handleDrop(nodes.length + 1, monitor.getClientOffset()),
              collect: (monitor) => ({ isOver: !!monitor.isOver() }),
            })[1]
          }
        >
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            edgeTypes={edgeTypes}
            nodeTypes={nodeTypes}
            onLoad={(reactFlowInstance) => reactFlowInstance.fitView()}
            snapToGrid
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <div className="rightSide w-25 d-flex flex-column">
          {nodeId && isDrawerOpen ? (
            <ChangeLabel
              setText={setText}
              setNodeId={setNodeId}
              setIsDrawerOpen={setIsDrawerOpen}
              updateLabelOfNode={updateLabelOfNode}
            />
          ) : (
            <RightSideItem
              id={nodes.length + 1}
              label="Message"
              ref={addNodeRef}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default ReactFlowComponent;
