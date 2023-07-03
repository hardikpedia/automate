import { useState, useEffect } from "react";
import { FetchIssues } from "../components/FetchIssues";
import { CherryPick } from "@/components/CherryPick";
import { CreateBranch } from "@/components/CreateBranch";
import { FetchContext } from "@/Contexts/FetchContext";

export default function Home() {
  const [issueRendered, setIssueRendered] = useState(false);
  const [project_id, setProjectId] = useState("");
  const [branch, setBranch] = useState("");
  const [mergeIdList, setMergeIdList] = useState([]);
  const [isBranchCreated, setIsBranchCreated] = useState(false);
  const [targetBranch, setTargetBranch] = useState({
    value: "live",
    label: "live",
  });

  return (
    <>
      <FetchContext.Provider
        value={{
          setIssueRendered,
          setProjectId,
          setMergeIdList,
          project_id,
          setBranch,
          branch,
          setIsBranchCreated,
          mergeIdList,
          issueRendered,
          targetBranch,
          setTargetBranch,
        }}
      >
        <FetchIssues />
        {issueRendered && <CreateBranch />}
        {isBranchCreated && <CherryPick />}
      </FetchContext.Provider>
    </>
  );
}
