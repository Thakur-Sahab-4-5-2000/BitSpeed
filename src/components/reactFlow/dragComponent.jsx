/* eslint-disable react/prop-types */
import ChatIcon from "@mui/icons-material/Chat";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../../constants/constants";

export default function RightSideItem({ id, label }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.NODE,
    item: () => ({ id }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <button
      ref={dragRef}
      className="drag-drop-container d-flex flex-column justify-content-center align-items-center"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onDragOver={(e) => e.preventDefault()}
    >
      <ChatIcon className="chatIconRight" />
      <span>{label}</span>
    </button>
  );
}
