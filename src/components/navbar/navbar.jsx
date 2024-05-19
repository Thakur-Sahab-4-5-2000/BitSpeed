/* eslint-disable react/prop-types */
import "./navbar.scss";
import { toast } from "react-toastify";

function Navbar({ nodes, edges }) {
  const handleSave = () => {
    const allNodesConnected = nodes.every((node) => {
      const isNodeConnected = edges.some(
        (edge) => edge.source === node.id || edge.target === node.id
      );
      return isNodeConnected;
    });

    if (!allNodesConnected) {
      toast.error("Not all nodes are connected.");
      return;
    }
    localStorage.clear();
    localStorage.setItem("nodes", JSON.stringify(nodes));
    localStorage.setItem("edges", JSON.stringify(edges));
    toast.success("Changes have been saved to local storage!");
  };
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-end"
      id="navbar"
    >
      <div className="d-flex flex-col justify-content-center align-items-center buttons-container">
        <button className="btn save" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Navbar;
