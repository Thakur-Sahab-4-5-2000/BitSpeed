/* eslint-disable no-unused-vars */
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

function ReactFlowComponent() {
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
  const edgeTypes = useMemo(() => ({ "custom-edge": CustomEdge }), []);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const addNodeRef = useRef(null);

  const getItemsFromLocalStorage = (key) => {
    const storedItems = localStorage.getItem(key);
    return storedItems ? JSON.parse(storedItems) : [];
  };

  useEffect(() => {
    setNodes(getItemsFromLocalStorage("nodes"));
    setEdges(getItemsFromLocalStorage("edges"));
  }, []);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.NODE,
    drop: (item, monitor) => {
      handleDrop(nodes.length + 1, monitor.getClientOffset());
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  });

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
      const hasOutgoingEdge = edges.some(
        (edge) => edge.source === connection.source
      );

      if (hasOutgoingEdge) {
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
      if (clientOffset) {
        const containerRect = document
          .querySelector(".flow-content")
          .getBoundingClientRect();
        const newPosition = {
          x: clientOffset.x - containerRect.left,
          y: clientOffset.y - containerRect.top,
        };

        const newNode = {
          id: `node-${nodes.length + 1}`,
          type: "textUpdater",
          position: newPosition,
          data: { label: id },
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
      } else {
        toast.error("Client offset is null");
      }
    },
    [nodes.length]
  );

  return (
    <>
      <Navbar nodes={nodes} edges={edges} />
      <div className="main-content w-100 d-flex flex-row">
        <div className="flow-content w-75" ref={drop}>
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
          <RightSideItem
            id={nodes.length + 1}
            label="Message"
            ref={addNodeRef}
          />
        </div>
      </div>
    </>
  );
}

export default ReactFlowComponent;
