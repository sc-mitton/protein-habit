import { exec } from "child_process";
import { promisify } from "util";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Promisify exec
const execAsync = promisify(exec);

async function main() {
  try {
    // Step 1: Generate recipes (description and ingredients list)
    console.log("Step 1: Generating recipes...");
    await execAsync("bun run scripts/recipesPipeline/generateRecipes.ts");
    console.log("✅ Recipes generated successfully\n");

    // Step 2: Generate relations (tags for each recipe)
    console.log("Step 2: Generating recipe relations...");
    await execAsync("bun run scripts/recipesPipeline/generateRelations.ts");
    console.log("✅ Recipe relations generated successfully\n");
  } catch (error) {
    console.error("\n❌ Pipeline failed:", error);
    process.exit(1);
  }
}

// Run the pipeline
main();
