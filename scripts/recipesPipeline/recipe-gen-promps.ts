import type { Dish } from "./generateRecipes";

const role =
  "You are a professional chef with expert level knowledge of food and cooking.";
const overview =
  "We are focused on high protein recipes that are practical for home cooking, easy to make, and healthy.";

const fix = ({
  instructions,
  ingredients,
}: {
  instructions?: string;
  ingredients?: string;
}) => `
${overview}
Make sure there are no spelling mistakes in the instructions and ingredients for the following recipe. Also,
if you feel that the recipe should be improved based on your expert knowledge of food and cooking, please make the
necessary changes. Additionally, if there are missing instructions, and the reader would not be able to make the recipe
without additional information, please add the missing instructions.
${instructions ? "Lastly, change up the wording of the instructions, but keep the original meaning." : ""}
${instructions ?? ""}
${ingredients ?? ""}
`;

const create = ({ dish }: { dish: string }) => {
  return `
${overview}
Produce a recipe for the following dish: ${dish}
`;
};

const prompt = (dish: Dish) => {
  let prompt = "";

  if (dish.ingredients || dish.instructions) {
    prompt = fix({
      instructions: dish.instructions,
      ingredients: dish.ingredients,
    });
    return prompt;
  } else {
    prompt = create({ dish: dish.name });
    return prompt;
  }
};

export { prompt, role };
