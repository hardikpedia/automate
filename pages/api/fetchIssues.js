const axios = require("axios");
import { decryptCookie } from "./cookieHandler";
import { getCookies, hasCookie } from "cookies-next";
import { getCloudId } from "@/services/getCloudId";
import refreshTokens from "./refreshTokens";
import { extractGitLabPullRequestLinks } from "@/utils/gitlabPrUtil";
require("dotenv").config();
import { collection, setDoc,doc,getDoc } from 'firebase/firestore';
import {db} from '../../firebaseConfig'


// Jira API configuration
const jiraApiUrl = process.env.JIRA_API_URL;

// GitLab API configuration
const gitlabApiUrl = process.env.GITLAB_API_URL;
let project_id = null;

// Function to fetch Jira issues and extract GitLab pull request links
async function fetchJiraIssues(
  jqlQuery,
  cloudId,
  jiraAccessToken,
  gitlabAccessToken
) {
  try {
    const pullRequestMap = new Map();

    // Fetch Jira issues based on the provided JQL query
    const response = await axios.get(
      `${jiraApiUrl}/${cloudId}/rest/api/2/search`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jiraAccessToken}`,
        },
        params: {
          jql: jqlQuery,
          fields: "summary,status,description,comment",
        },
      }
    );

    const issues = response.data.issues;
    if (issues.length == 0) {
      return [], null;
    }
    // Iterate over each issue and extract GitLab pull request links from the comments
    for (let issue of issues) {
      const { key, fields } = issue;
      const { comment } = fields;

      const gitlabPullRequestLinks = extractGitLabPullRequestLinks(
        comment.comments
      );

      // If GitLab pull request links are found, extract merge details for each link
      if (gitlabPullRequestLinks.length > 0) {
        for (let link of gitlabPullRequestLinks) {
          const { mergeCommitId, mergeTime } = await getMergeDetailsFromLink(
            link,
            gitlabAccessToken
          );
          const issueKey = key;
          pullRequestMap.set(mergeCommitId, { issueKey, mergeTime });
        }
      }
    }

    // Sort the pull request map based on merge time
    const sortedPullRequestMap = [...pullRequestMap].sort((a, b) => {
      const dateA = new Date(a[1].mergeTime);
      const dateB = new Date(b[1].mergeTime);
      return dateA - dateB;
    });

    return sortedPullRequestMap;
  } catch (error) {
    console.error("Error fetching Jira issues:", error);
    throw error;
  }
}

// Function to get merge commit id and merge time by extracting project id and merge request id from the merge request link
async function getMergeDetailsFromLink(mergeRequestLink, gitlabAccessToken) {
  try {
    const url = new URL(mergeRequestLink);
    const path = url.pathname.split("/");
    const projectName = path[2];
    const mergeRequestId = path[5];

    // Get the project ID from GitLab API based on the project name
    const response = await axios.get(
      `${gitlabApiUrl}/projects?owned=yes&search=${projectName}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gitlabAccessToken}`,
        },
      }
    );

    const projectId = response.data[0].id;
    project_id = projectId;
    // Get merge commit details using project ID and merge request ID
    const { mergeCommitId, mergeTime } = await getMergeCommitDetails(
      projectId,
      mergeRequestId,
      gitlabAccessToken
    );

    return { mergeCommitId, mergeTime };
  } catch (error) {
    console.error(
      "Error fetching merge request details from GitLab:",
      error.response.data
    );
    throw error;
  }
}

// Function to get merge commit id and merge time from merge request id and project id
async function getMergeCommitDetails(
  projectId,
  mergeRequestId,
  gitlabAccessToken
) {
  try {
    const url = `${gitlabApiUrl}/projects/${projectId}/merge_requests/${mergeRequestId}`;

    // Fetch merge request details from GitLab API
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${gitlabAccessToken}`,
      },
    });

    const mergeCommitId = response.data.merge_commit_sha;
    const mergeTime = response.data.merged_at;
    return { mergeCommitId, mergeTime };
  } catch (error) {
    console.error("Error retrieving merge commit ID:", error);
    throw error;
  }
}


// API endpoint to fetch issues
export default (async (req, res) => {
  // Check if the necessary access tokens are present in the cookies
  // if (
  //   hasCookie("atlassianAccessToken1", { req, res }) &&
  //   hasCookie("atlassianAccessToken2", { req, res }) &&
  //   hasCookie("gitlabAccessToken", { req, res })
  // ) {
    // Refresh access tokens if expired
    // await refreshTokens(req, res);

    // Get the access tokens from cookies
    // const { atlassianAccessToken1, atlassianAccessToken2, gitlabAccessToken } =
    //   getCookies({ req, res });

    // // Decrypt the access tokens
    // const decryptedAtlassianAccessToken =
    //   decryptCookie(atlassianAccessToken1) +
    //   decryptCookie(atlassianAccessToken2);
    // const decryptedGitlabAccessToken = decryptCookie(gitlabAccessToken);
    const dbRef = doc(db, 'auth', 'hardikgupta0506@gmail.com');
    const docSnap = await getDoc(dbRef);
    const decryptedAtlassianAccessToken = docSnap.data().atlassianAccessToken;
    const decryptedGitlabAccessToken = docSnap.data().gitlabAccessToken;


    // Get the cloud ID for Jira API requests
    const cloudId = await getCloudId(decryptedAtlassianAccessToken, req, res);
    // Fetch Jira issues and extract GitLab pull request links
    const mergeIdList = await fetchJiraIssues(
      req.body.inputQuery,
      cloudId,
      decryptedAtlassianAccessToken,
      decryptedGitlabAccessToken
    );
    // Send the response with the merge ID list and project ID
    res.status(200).json({ mergeIdList, project_id });
  // } else {
  //   // Return an unauthorized error if access tokens are not present
  //   res.status(401).json({ message: "Unauthorized" });
  // }
});
