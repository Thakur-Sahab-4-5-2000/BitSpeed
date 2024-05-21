/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useCallback, useState } from "react";
import { Handle, Position } from "reactflow";
import ChatIcon from "@mui/icons-material/Chat";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import "./reactFlow.scss";

// eslint-disable-next-line react/prop-types
function TextUpdaterNode({ id, data, onClick, text }) {
  const handleClick = () => {
    onClick(id);
  };
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="node-container d-flex flex-column">
        <div className="node-header d-flex flex-row justify-content-between align-items-center">
          <div className="d-flex flex-row align-items-center">
            <ChatIcon className="chatIcon" />
            <span className="header-text">Send Messages</span>
          </div>
          <WhatsAppIcon className="whatsAppIcon" />
        </div>
        <input
          id="text"
          name="text"
          className="nodrag input-field"
          value={text || data?.label}
          onClick={handleClick}
          readOnly
        />
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}

export default TextUpdaterNode;