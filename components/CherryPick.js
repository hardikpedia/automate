import { useState, useContext } from "react";
import { FetchContext } from "../Contexts/FetchContext";
import SearchableConflictsTable from "./ConflictsTable";
import { Alert } from "@mui/material";
import { AlertTitle } from "@mui/material";
import Image from "next/image";
import GitlabIcon from "../public/gitlab.png";
export function CherryPick() {
  // Accessing values from the FetchContext
  const { project_id, branch, mergeIdList, targetBranch } =
    useContext(FetchContext);

  // State variables to manage component state
  const [conflicts, setConflicts] = useState("");
  const [isPicking, setIsPicking] = useState(false);
  const [isPickingDone, setIsPickingDone] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [mergeRequestUrl, setMergeRequestUrl] = useState("");
  const [error, setError] = useState(null);

  // Function to perform cherry picking of issues
  const cherryPickIssues = async () => {
    setIsPicking(true);

    // Send a POST request to the server with the required data
    const response = await fetch("/api/cherryPick", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mergeIdList, branch, project_id }),
    });

    // Get the response data
    const data = await response.json();

    // Update state variables with the response data
    setConflicts(data.conflict);
    console.log(data.conflict);
    setIsPicking(false);
    setIsPickingDone(true);
  };

  // Function to create a merge request
  const createMergeRequest = async () => {
    setIsCreating(true);
    // Send a POST request to create a merge request
    const response = await fetch("/api/createMergeRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id,
        source_branch: branch,
        target_branch: targetBranch.value,
      }),
    });

    // Get the response data
    const data = await response.json();

    // Update state variables with the response data
    if (data.mergeRequestUrl.errorMessage) {
      setError(data.mergeRequestUrl.errorMessage);
      setMergeRequestUrl(null);
    } else {
      setMergeRequestUrl(data.mergeRequestUrl);
      setError(null);
    }

    // Update state variable
    setIsCreating(false);
  };

  return (
    <div className="mb-4 flex flex-col items-center">
      {/* Button to trigger cherry picking */}
      <button
        disabled={isPicking}
        onClick={cherryPickIssues}
        className="mt-8  py-2 px-4 rounded-full border-2 border-sprinklr-blue hover:bg-sprinklr-blue hover:text-white transition-all duration-300"
      >
        {isPicking ? "Cherry Picking..." : "Cherry Pick All"}
      </button>

      {/* Render the cherry pick result */}
      {isPickingDone && (
        <div className="mt-8">
          {conflicts.length > 0 ? (
            // Render conflicting commits if there are any
            <>
              {/* <h2 className="text-2xl font-bold mb-4">Conflicting Commits:</h2> */}
              <div className="flex flex-col items-center gap-8">
                {/* List of conflicting commits */}

                <SearchableConflictsTable issues={conflicts} />
                {/* Message to handle conflicts manually */}
                <div className="text-sprinklr-red font-bold items-center ">
                  <Alert severity="error" variant="outlined">
                    {/* <AlertTitle>Conflicts detected</AlertTitle> */}
                    Please resolve the conflicts manually
                  </Alert>
                </div>
              </div>
            </>
          ) : (
            <div>
             <Alert severity="success" variant="outlined">
              All commits are cherry picked successfully
            </Alert>
            </div>
           
          )}
        </div>
      )}

      {/* Create merge request section */}
      {isPickingDone && (
        <div className="flex gap-4 my-5 items-center">
          <div className="text-lg">
            Create a merge request to merge the
            <span className="font-mono text-sprinklr-green mx-2">
              [{branch}]
            </span>{" "}
            to the{" "}
            <span className="font-mono text-sprinklr-green mx-2">
              [{targetBranch.value}]
            </span>{" "}
            branch
          </div>
          <button
            className=" hover:bg-green-600 border-2 border-sprinklr-blue hover:text-white hover:bg-sprinklr-blue px-4 rounded-full py-2 transition-all duration-300"
            disabled={isCreating}
            onClick={createMergeRequest}
          >
            {/* Conditional rendering of button text */}
            {isCreating ? "Creating..." : "Create Merge Request"}
          </button>
        </div>
      )}

      {/* Display error and merge request URL */}
      <div className="mt-5">
        {error && (
          <Alert severity="error" variant="outlined">
            {error}
          </Alert>
        )}
        {mergeRequestUrl && (
          <Alert severity="success" variant="outlined">
            <AlertTitle>Merge request created successfully</AlertTitle>
            <div className="flex items-center text-sprinklr-blue ">
              <div className="">
                <Image
                  src={GitlabIcon}
                  alt="merge request"
                  width={30}
                  height={30}
                />
              </div>
              <a href={mergeRequestUrl} target="_blank">
                {mergeRequestUrl}
              </a>
            </div>
          </Alert>
        )}
      </div>
    </div>
  );
}
