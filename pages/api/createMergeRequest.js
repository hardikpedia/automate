const axios = require("axios");
import { decryptCookie } from "./cookieHandler";
import { getCookies, hasCookie } from "cookies-next";
import refreshTokens from "./refreshTokens";
require("dotenv").config();

// GitLab API configuration
const GITLAB_API_URL = process.env.GITLAB_API_URL;

const createMergeRequest = async (
  projectId,
  sourceBranch,
  targetBranch,
  accessToken
) => {
  try {
    const url = `${GITLAB_API_URL}/projects/${projectId}/merge_requests`;
    const headers = { Authorization: `Bearer ${accessToken}` };
    const data = {
      source_branch: sourceBranch,
      target_branch: targetBranch,
      title: `Merge branch ${sourceBranch} into ${targetBranch}`,
    };
    const response = await axios.post(url, data, { headers });
    return response.data.web_url;
  } catch (error) {
    // console.log(error);
    console.error(
      "Failed to create merge request:",
      error.response.data.message
    );
    return {
      errorMessage: error.response.data.message,
    };
  }
};

export default async (req, res) => {
  if (
    hasCookie("atlassianAccessToken1", { req, res }) &&
    hasCookie("atlassianAccessToken2", { req, res }) &&
    hasCookie("gitlabAccessToken", { req, res })
  ) {
    await refreshTokens(req, res);
    const { gitlabAccessToken } = getCookies({ req, res });
    const decryptedGitlabAccessToken = decryptCookie(gitlabAccessToken);
    console.log(req.body);
    const mergeRequestUrl = await createMergeRequest(
      req.body.project_id,
      req.body.source_branch,
      req.body.target_branch,
      decryptedGitlabAccessToken
    );
    res.status(200).json({ mergeRequestUrl });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};
