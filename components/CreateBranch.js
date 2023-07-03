import { useState, useContext, useEffect } from "react";
import { FetchContext } from "../Contexts/FetchContext";
import Select from "react-select";
import { getBranches } from "../services/getBranches";
import { customStyles } from "@/utils/customStyles";
import { newBranchName } from "@/utils/newBranchName";
import Image from "next/image";
import Skateboarding from "../public/1475.gif";

import { Alert } from "@mui/material";
export function CreateBranch() {
  // Accessing values and functions from FetchContext
  const {
    project_id,
    setIsBranchCreated,
    setBranch,
    mergeIdList,
    targetBranch,
    setTargetBranch,
  } = useContext(FetchContext);

  useEffect(() => {
    setIsLoading(true);
    const getBranchList = async () => {
      const branches = await getBranches(project_id);
      setOptions(branches);
      setIsLoading(false);
    };
    getBranchList();
  }, []);

  // State variables to manage component state
  // const [branchName, setBranchName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [options, setOptions] = useState();
  const [isLoading, setIsLoading] = useState(false);
  // Function to create a new branch
  const createBranch = async () => {
    setIsCreating(true);
    // const autoBranchName = await newBranchName(mergeIdList);
    const autoBranchName = "hotfix4.31";
    setBranch(autoBranchName);
    // Send a POST request to create a branch
    const response = await fetch("/api/createBranch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id,
        branchName: autoBranchName,
        sourceBranch: targetBranch.value,
      }),
    });

    // Get the response data
    const jsonData = await response.json();

    // Update state variables with the response data
    setMessage(jsonData.message);
    setIsCreating(false);
    setIsBranchCreated(true);
  };

  return (
    <div className=" flex flex-col items-center">
      {/* Display the project ID */}
      <div className="my-4 font-semibold">
        Project ID Of Gitlab Repository :{" "}
        <span className="font-mono text-green-700">{project_id}</span>
      </div>
      <div className="flex gap-2 items-center">
        {/* Label and input field for entering the new branch name */}
        <label className="text-lg ">
          Select the source branch on which you want to base the new hotfix
          branch:
        </label>
        {/* <input
          className="w-96 text-black ml-10 rounded pl-3"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
        /> */}
        {/* {isLoading ? (
          <div>
            <Image src={Skateboarding} alt="skate" />
          </div>
        ) : ( */}
        <div className="border-sprinklr-blue border-2 rounded">
          <Select
            onChange={setTargetBranch}
            options={options}
            styles={customStyles}
            placeholder="Default: live"
            isDisabled={isLoading}
            isLoading={isLoading}
          />
        </div>
        {/* )} */}
      </div>
      <button
        disabled={isCreating}
        onClick={createBranch}
        className="mt-8 bg-green-500 hover:bg-green-600 py-2 px-4 rounded-full  border-sprinklr-blue border-2 hover:bg-sprinklr-blue hover:text-white transition-all duration-300"
      >
        {/* Conditional rendering of button text */}
        {isCreating ? "Creating..." : "Create Branch"}
      </button>
      <div>
        {/* Display the branch creation message */}
        {message === "Branch already exists" ||
        message === "Failed to create new branch" ? (
          <div className="mt-5">
            <Alert severity="error" variant="outlined">
              {message}
            </Alert>
          </div>
        ) : (
          message && (
            <div className="mt-8">
              <Alert severity="success" variant="outlined">
                {message}
              </Alert>
            </div>
          )
        )}
      </div>
    </div>
  );
}
