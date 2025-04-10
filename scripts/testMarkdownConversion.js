function convertToMarkdown(data) {
  if (Array.isArray(data)) {
    // Check if it's an array of section objects
    if (
      data.length > 0 &&
      typeof data[0] === "object" &&
      "section_title" in data[0] &&
      "items" in data[0]
    ) {
      return data
        .map((section) => {
          return `## ${section.section_title}\n${section.items.map((item) => `- ${item}`).join("\n")}`;
        })
        .join("\n\n");
    }
    // Simple array of strings
    return data.map((item) => `- ${item}`).join("\n");
  } else if (typeof data === "object" && data !== null) {
    // Handle Record<string, string[]> format
    return Object.entries(data)
      .map(([section, items]) => {
        if (Array.isArray(items)) {
          return `## ${section.charAt(0).toUpperCase() + section.slice(1)}\n${items.map((item) => `- ${item}`).join("\n")}`;
        } else if (typeof items === "object" && items !== null) {
          return `## ${section.charAt(0).toUpperCase() + section.slice(1)}\n${convertToMarkdown(items)}`;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return "";
}

// Test cases
const testCases = [
  {
    name: "Simple array",
    input: ["1 cup of milk", "1/2 cup of almonds", "1 cup of parmesan"],
  },
  {
    name: "Object with sections",
    input: {
      main: ["1 cup of milk", "1/2 cup of almonds", "1 cup of parmesan"],
      sauce: ["1 lemon", "1/4 cup of heavy cream"],
    },
  },
  {
    name: "Multiple sections",
    input: {
      ingredients: ["1 cup of milk", "1/2 cup of almonds"],
      instructions: ["Mix ingredients", "Cook for 10 minutes"],
    },
  },
];

// Run tests
console.log("Testing markdown conversion:\n");

testCases.forEach((test, index) => {
  console.log(`\n\nTest ${index + 1}: ${test.name}`);
  console.log("Input:", JSON.stringify(test.input, null, 2));
  console.log("\n\nOutput:");
  const result = convertToMarkdown(test.input);
  console.log(result);
});
