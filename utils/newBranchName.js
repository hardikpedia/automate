export const newBranchName = async(mergeIdList) => {
  const newBranchId =await mergeIdList.map((issue) => {
    return issue[1].issueKey;
  });
  const newBranchName = await convertString(`cherry-picker-${newBranchId.join("-")}`);
  console.log(newBranchName);
  return newBranchName;
};

const convertString =async (inputString) => {
  const regex = /-(\d+)/g;
  const convertedString = await inputString.replace(
    regex,
    (_, digits) => `[${digits}]`
  );
  return inputString;
};
