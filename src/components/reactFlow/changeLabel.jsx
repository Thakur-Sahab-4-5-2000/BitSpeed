/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TextareaAutosize } from "@mui/material";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import styles from "./ChangeLabel.module.scss";

// eslint-disable-next-line react/prop-types
function ChangeLabel({
  setIsDrawerOpen,
  updateLabelOfNode,
  deleteNodeAndEdges,
}) {
  const [open, setOpen] = useState(false);
  const nodeId = localStorage.getItem("nodeId");

  const handleOpen = () => setOpen(true);
  const handleClose = (nodeId) => {
    deleteNodeAndEdges(nodeId);
    setOpen(false);
    setIsDrawerOpen(false);
  };

  const textHandler = (e) => {
    if (e.target.value === "" || e.target.value === null) {
      toast.warn("Enter some value to update the node message!");
      return;
    }
    updateLabelOfNode(nodeId, e.target.value);
    toast.success("Message changed inside the node!");
  };

  return (
    <div className={styles.container}>
      <div className={styles.headingContainer}>
        <ArrowBackIcon
          className={styles.backArrow}
          onClick={() => {
            localStorage.removeItem("nodeId");
            setIsDrawerOpen(false);
          }}
        />
        <Typography variant="h6">Message</Typography>
      </div>
      <div className={styles.textFieldContainer}>
        <Typography variant="subtitle1">Edit Details for {nodeId}</Typography>
        <Typography variant="body2">Text</Typography>
        <TextareaAutosize
          minRows={4}
          className={styles.textField}
          onBlur={textHandler}
        />
      </div>
      <Button
        variant="contained"
        className={styles.deleteButton}
        onClick={handleOpen}
      >
        Delete Node
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modalBox}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            className={styles.modalTitle}
          >
            Confirm Deletion
          </Typography>
          <Typography id="modal-modal-description">
            Are you sure you want to delete this node?
          </Typography>
          <div className={styles.modalActions}>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleClose(nodeId);
              }}
            >
              Delete
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default ChangeLabel;
