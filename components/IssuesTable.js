import { useState } from "react";
import { Search as SearchIcon } from "@material-ui/icons";
import { Icon } from "@material-ui/core";

function SearchableIssuesTable({ issues }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredIssues = issues
    .filter(
      (issue) =>
        issue[1].issueKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue[0].toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a[1].mergeTime) - new Date(b[1].mergeTime);
      } else {
        return new Date(b[1].mergeTime) - new Date(a[1].mergeTime);
      }
    });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
  };

  const handleSortToggle = () => {
    if (sortOrder === "asc") {
      setSortOrder("desc");
    } else {
      setSortOrder("asc");
    }
  };

  const formatCreationTime = (mergeTime) => {
    const date = new Date(mergeTime);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-">Fetched Issues:</h2>
        <div className="flex">
          <button className="search-button" onClick={handleSearchToggle}>
            <SearchIcon />
            <span className="ml-2">Search</span>
          </button>
        </div>
      </div>
      {showSearch && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-96 border border-sprinklr-gray p-2 rounded-md "
          />
        </div>
      )}
      <div className="table-container">
        <table className="table-auto border-collapse border border-sprinklr-gray min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b border-r border-sprinklr-gray w-48">
                Issue Key
              </th>
              <th className="px-4 py-2 border-b border-l  border-r border-sprinklr-gray w-96">
                Merge Commit SHA
              </th>
              <th className="px-4 py-2 border-b border-l  border-r border-sprinklr-gray w-48">
                PR Creation Time
                <button className="sort-button ml-2" onClick={handleSortToggle}>
                  {sortOrder === "asc" ? (
                    <span>&#x25B2;</span>
                  ) : (
                    <span>&#x25BC;</span>
                  )}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No issues found.
                </td>
              </tr>
            ) : (
              filteredIssues.map((issue) => (
                <tr key={issue[0]} className="border border-sprinklr-gray">
                  <td className="px-4 py-2 border-r border-sprinklr-gray">
                    {issue[1].issueKey}
                  </td>
                  <td className="px-4 py-2 border-l border-r border-sprinklr-gray font-mono">
                    {issue[0]}
                  </td>
                  <td className="px-4 py-2 border-l border-r border-sprinklr-gray">
                    {formatCreationTime(issue[1].mergeTime)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SearchableIssuesTable;
