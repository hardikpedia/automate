const axios = require("axios");
require("dotenv").config();
import { decryptCookie } from "./cookieHandler";
import { getCookies, hasCookie } from "cookies-next";
import refreshTokens from "./refreshTokens";

// GitLab API configuration
const GITLAB_API_URL = process.env.GITLAB_API_URL;

//Function for traversing the the list of merge commits for cherry picking and logging the conflicts if any
async function cherryPickList(
  mergeIdList,
  projectId,
  branchName,
  conflict,
  gitlabAccessToken
) {
  for (const data of mergeIdList) {
    const commit_sha = data[0];
    const jiraIssueId = data[1];
    console.log("The jiraIssueId:", jiraIssueId.issueKey);
    console.log("Working on merge commit id:", commit_sha);
    //Cherry-picking the merge commit
    await cherryPickCommit(
      commit_sha,
      projectId,
      branchName,
      jiraIssueId.issueKey,
      conflict,
      gitlabAccessToken
    );
    console.log("---------------------------------");
  }
  //logging the conflicts if any

  if (conflict.size > 0) {
    const entries = conflict.entries();
    console.log("The Conflicts are:");
    for (const [key, values] of entries) {
      console.log(`Merge Commit ID : ${key} => Jira Issue Key : ${values.message}`);
    }
  }
}

//Function to cherry-pick a merge commit using the commit SHA, project ID, and target branch
//Passing the issueKey for reference in case of conflicts
//Passing the conflict map to the function to store the merge commit id and the jira issue id

const cherryPickCommit = async (
  commit_sha,
  project_id,
  target_branch,
  issueKey,
  conflict,
  gitlabAccessToken
) => {
  try {
    const projectID = project_id;
    const commitSha = commit_sha;
    const branchName = target_branch; // The branch you want to cherry-pick the commit into
    
    const url = `${GITLAB_API_URL}/projects/${projectID}/repository/commits/${commitSha}/cherry_pick`;
    //Post request to cherry-pick the merge commit
    const response = await axios.post(
      url,
      {
        branch: branchName,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gitlabAccessToken}`,
        },
      }
    );

    console.log(
      `Merge commit ${commitSha} cherry-picked into the branch successfully.`
    );
  } catch (error) {
    const message=error.response.data.message;
    conflict.set(commit_sha, {issueKey,message}); //storing the merge commit id and the jira issue id in case of conflicts
    console.log(
      "Failed to cherry-pick the merge commit:",
      error.response.data.message
    );
  }
};

//API endpoint for cherry-picking the merge commits
export default async (req, res) => {
  const project_id = req.body.project_id;
  const mergeIdList = req.body.mergeIdList;
  const conflict = new Map();

  console.log("The mergeIdList:", mergeIdList);
  // const session = await getServerSession(req, res, authOptions);
  if (
    hasCookie("gitlabAccessToken", { req, res }) &&
    hasCookie("atlassianAccessToken2", { req, res }) &&
    hasCookie("atlassianAccessToken1", { req, res })
  ) {
    await refreshTokens(req, res);
    const branchName = req.body.branch;
    const { gitlabAccessToken } = getCookies({ req, res });
    const decryptedGitlabAccessToken = decryptCookie(gitlabAccessToken);

    await cherryPickList(
      mergeIdList,
      project_id,
      branchName,
      conflict,
      decryptedGitlabAccessToken
    );
    res.status(200).json({ conflict: [...conflict] });
  } else {
    res.status(401);
  }
};
