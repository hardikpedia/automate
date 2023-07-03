// Function to extract GitLab pull request links from issue comments
export function extractGitLabPullRequestLinks(comments) {
  const gitlabPrRegex = /https?:\/\/gitlab\.com\/.+\/merge_requests\/\d+/g;

  const links = [];
  comments.forEach((comment) => {
    const matches = comment.body.match(gitlabPrRegex);
    if (matches) {
      links.push(...matches);
    }
  });
  return links;
}
