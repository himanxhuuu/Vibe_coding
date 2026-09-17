import { priorityClass } from "../utils/constants.js";

export default function StatusBadge({ priority }) {
  return (
    <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${priorityClass[priority]}`}>
      {priority}
    </span>
  );
}
