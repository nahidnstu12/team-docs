"use client";

import { useState } from "react";
import AssignDevHeader from "./AssignDevHeader";
import DevListings from "./DevListings";

export default function AssignDevClient({ project, workspaceId }) {
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const handleAssignSuccess = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  const handleRemoveDevSuccess = () => {
    setRefetchTrigger((prev) => prev + 1);
  };

  return (
    <>
      <AssignDevHeader
        projectName={project.name}
        workspaceId={workspaceId}
        onAssignSuccess={handleAssignSuccess}
        projectId={project.id}
      />
      <DevListings
        projectId={project.id}
        refetchTrigger={refetchTrigger}
        onRemoveDevSuccess={handleRemoveDevSuccess}
      />
    </>
  );
}
