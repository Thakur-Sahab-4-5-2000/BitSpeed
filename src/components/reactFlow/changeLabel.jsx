import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TextareaAutosize } from "@mui/material";

// eslint-disable-next-line react/prop-types
function ChangeLabel({ setIsDrawerOpen, updateLabelOfNode }) {
  const nodeId = localStorage.getItem("nodeId");
  return (
    <div className="d-flex flex-column">
      <div className="heading-container d-flex flex-row justify-content-center align-items-center">
        <ArrowBackIcon
          className="back-arrow"
          onClick={() => {
            localStorage.removeItem("nodeId");
            setIsDrawerOpen(false);
          }}
        />
        <span>Message</span>
      </div>
      <div className="d-flex flex-column text-field-container">
        <span>Edit Details for {nodeId}</span>
        <span>Text</span>
        <TextareaAutosize
          minRows={4}
          className="text-field"
          onBlur={(e) => {
            updateLabelOfNode(nodeId, e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default ChangeLabel;
