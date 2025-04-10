import _ from "lodash";

const capitalize = (str: string) => {
  return str
    .split(" ")
    .map((word) => _.capitalize(word))
    .join(" ");
};

export { capitalize };
