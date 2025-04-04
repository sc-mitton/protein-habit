from langchain.prompts import PromptTemplate

generation_prompt = PromptTemplate.from_template(
    template="""
        ** You are a nutrition expert with vast knowledge of highly accurate nutrition data.**
        How much protein is in each of the following food items?
        Food Items:
        {{text}}

        **Response Format:**
        [
            {
                "food_item": "food_item_name",
                "protein_amount": "protein_amount",
                "protein_unit": "protein_unit"
            },
            {
                "food_item": "food_item_name",
                "protein_amount": "protein_amount",
                "protein_unit": "protein_unit"
            },
            ...
        ]

        **Important:**
        - If the protein amount for a food item is unknown, return your best guess based on your knowledge of the food item.
        - Only include food items in your response that are mentioned in the meal description and have a protein amount.
        - Always include the `protein_unit` (e.g., "grams", "oz").
        - Ensure that the JSON format is valid and correctly structured.
        - Unless otherwise specified, assume the amounts in the nutrition data are in grams.
        - Adjust the protein amount from the nutrition data based on the ratio of the serving size of the nutriotion data
         and the amount of the food item in the original user input.
        - Shorten the food names if necessary to make them concise.
        - The conversion from grams to ounces is 1oz = 28.35g

        NutritionData:
        {{data}}

        Original User Input:
        {{original_input}}
    """,
    template_format='mustache'
)
