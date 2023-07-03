import { useState, useContext, useEffect } from "react";
import { FetchContext } from "../Contexts/FetchContext";
import { signIn, signOut } from "next-auth/react";
import GitlabButton from "./GitlabButton";
import JiraButton from "./JiraButton";
import SignOutButton from "./SignOutButton";
import { getCookies } from "cookies-next";
import { useRouter } from "next/router";
import { clearCookies } from "@/utils/cookieHandler";
import Image from "next/image";
import Sprinklr from "../public/sprinklr.png";
import Alert from "@mui/material/Alert";
import SearchableIssuesTable from "./IssuesTable";

export function FetchIssues() {
  const { setIssueRendered, setProjectId, setMergeIdList, issuesRendered } =
    useContext(FetchContext);

  // State variables to manage component state
  const [query, setQuery] = useState("");
  const [issues, setIssues] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isJiraSignedIn, setIsJiraSignedIn] = useState(false);
  const [isGitlabSignedIn, setIsGitlabSignedIn] = useState(false);
  const router = useRouter();

  // Get access tokens from cookies on initial component render
  const { atlassianAccessToken1, atlassianAccessToken2, gitlabAccessToken } =
    getCookies();

  useEffect(() => {
    // Check if Jira and GitLab are signed in based on access tokens
    if (atlassianAccessToken1 && atlassianAccessToken2) {
      setIsJiraSignedIn(true);
    }
    if (gitlabAccessToken) {
      setIsGitlabSignedIn(true);
    }
  }, []);
  // Function to sign in to Jira
  const handleJiraSignIn = async () => {
    await signIn("atlassian");
  };
  // Function to sign in to GitLab
  const handleGitLabSignIn = async () => {
    await signIn("gitlab");
  };
  // Function to sign out of Jira and GitLab
  const handleSignOut = async () => {
    await signOut();

    // Clear cookies and reload the page
    clearCookies();
    router.reload();
  };

  //alert if no query is entered
  const fetchIssues = async (inputQuery) => {
    if (inputQuery === "") {
      alert("Enter some Query!");
      return;
    }

    // if (validateJqlQuery(inputQuery)===false) {
    //   alert("Enter a valid JQL!");
    //   return;
    // }
    setIsFetching(true);

    try {
      // Send a POST request to fetch issues
      const response = await fetch("/api/fetchIssues/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputQuery }),
      });

      // Get the response data
      const jsonData = await response.json();
      const { mergeIdList, project_id } = jsonData;
      // if (mergeIdList === null) {
      //   alert("No issues found!");
      //   setIsFetching(false);
      //   setIssues(mergeIdList);
      //   setMergeIdList(mergeIdList);
      //   setProjectId(project_id);
      //   return;
      // }
      // Update state variables with the fetched data
      setIssues(mergeIdList);
      setMergeIdList(mergeIdList);
      setProjectId(project_id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setIsFetching(false);
    setIssueRendered(true);
  };

  return (
    <div className="container mx-auto p-8 flex flex-col items-center">
      <div className="flex ">
        {/* Display the Sprinklr image */}
        <Image
          src={Sprinklr}
          alt="Sprinklr"
          priority
          width={200}
          className="absolute left-0 top-0 "
        />

        <h1 className="text-4xl  mb-8 font-display">
          Cherry Picking Automation
        </h1>
        <div className="ml-4 flex absolute right-4">
          {/* Render the GitlabButton and JiraButton components */}
          <GitlabButton
            text={isGitlabSignedIn ? "Connected" : "Connect GitLab"}
            isGitlabSignedIn={isGitlabSignedIn}
            onClick={handleGitLabSignIn}
          />
          <JiraButton
            text={isJiraSignedIn ? "Connected" : "Connect Jira"}
            isJiraSignedIn={isJiraSignedIn}
            onClick={handleJiraSignIn}
          />

          {/* Render the SignOutButton component if both Jira and GitLab are signed in */}
          {isJiraSignedIn && isGitlabSignedIn && (
            <SignOutButton onClick={handleSignOut} />
          )}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <label className="text-lg font-medium ">JQL Query: </label>
        {/* Input field for entering the JQL query */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-64 border border-gray-300 p-2 rounded text-black disabled:cursor-not-allowed"
          disabled={!isJiraSignedIn || !isGitlabSignedIn}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchIssues(query);
            }
          }}
        />
        <button
          className=" hover:bg-sprinklr-blue hover:text-white py-2 px-4 rounded-full border-sprinklr-blue border-2 transition-all duration-300"
          disabled={isFetching}
          onClick={() => fetchIssues(query)}
        >
          {/* Conditional rendering of button text */}
          {isFetching ? "Fetching..." : "Fetch Data"}
        </button>
      </div>

      {/* Render the fetched issues if there are any */}
      {/* {issues === null && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">No Issues Found</h2>
        </div>
      )} */}
      {issues !== null && issues.length > 0 && (
        // <div className="mt-8">
        //   <h2 className="text-2xl font-bold mb-4">Fetched Issues:</h2>
        //   <ul className="grid grid-cols-2 gap-4 font-mono">
        //     {issues.map((issue) => (
        //       <li
        //         key={issue[0]}
        //         className="p-2 border border-gray-300 rounded flex items-center"
        //       >
        //         <span className="font-bold text-red-300 mr-2 ">
        //           {issue[1].issueKey}:{" "}
        //         </span>
        //         <span>{issue[0]}</span>
        //       </li>
        //     ))}
        //   </ul>
        // </div>
        <SearchableIssuesTable issues={issues} />
      )}
    </div>
  );
}
