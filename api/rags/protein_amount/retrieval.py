from langchain.prompts import PromptTemplate
from jinja2 import Template
import re

get_restaurant_or_brand_prompt = PromptTemplate.from_template(
    """
    Determine if the input text contains a **menu item** from a popular restaurant chain,
    or if it is a **branded grocery product**. If it is a menu item from a well-known restaurant,
    return the restaurant's name. If it is a branded food item from a grocery store, return the brand name.

    **IMPORTANT:**
    - If the input text is empty (""), immediately return 'none' without any additional text.
    - If you cannot confidently determine the restaurant or brand, return 'none' without any additional text.
    - Correct the spelling of the restaurant or brand name if necessary.

    **Clarification:**
    - A **restaurant menu item** is a food or drink that is primarily sold at a specific restaurant chain
      (e.g., "Big Mac" -> restaurant_name: McDonald's).
    - A **branded grocery product** is a packaged food item sold in stores under a brand name
      (e.g., "Cheerios" -> brand_name: General Mills).

    **Format of your response (without explanation or additional text):**
    restaurant_name: restaurant_name
    or
    brand_name: brand_name
    or
    none

    Input text: "{text}"
    """
)

food_items_prompt = PromptTemplate.from_template(
    """
    Identify all of the main food or menu items from the following food description: {text}.
    Format your response as a list of strings e.g. ["food_item_1", "food_item_2", ...]

    **IMPORTANT:**
    - Do not include restaurant names or brand names in your response.
    - Remove all non-alphanumeric characters from each item in your response, but keep spaces.
    - Only include the core food item name, not any modifiers or additional information.
    - Infer any additional food items from the food description. For example, if the food description
        is "Chicken Wrap", then you should infer that "Tortilla" should be included. Or if the food description
        is "Chicken BLT", then you should recognize this is a sandwich and include "Bread" in the list.
    - Expand any abbreviations or acronyms in the food description to their full form.
    - Make sure there is no overlap between the food items in your response. For example, if the input text is
    'Chicken Wrap', then the list ['Chicken', 'Tortilla', 'Chicken Wrap'] is incorrect because there is overlap
    between 'Chicken Wrap' and 'Chicken'. The correct response is ['Chicken', 'Tortilla'].
    """
)

query_block_template = Template("""    SELECT {{ fields }}, tfts.rank
    FROM {{ table }} t
    INNER JOIN {{ table }}_fts tfts
    ON t.id = tfts.id
    WHERE {%- for d in description %} tfts.description MATCH '"{{ d }}"'
    {%- if not loop.last %}
    AND {%- endif %} {%- endfor %}
    {%- if brand_match %}
    AND tfts.brand_name MATCH '"{{ brand_match }}"'
    {%- elif restaurant_match %}
    AND tfts.restaurant MATCH '"{{ restaurant_match }}"'
    {%- endif %}
    ORDER BY tfts.rank
    LIMIT {{ limit }}
""")

final_query_template = Template("""WITH {%- for query in queries %}
query_{{ loop.index }} AS (
{{ query }}
){%- if not loop.last %},{%- endif %}
{%- endfor %}
{%- for query in queries %}
SELECT * FROM query_{{ loop.index }}
{%- if not loop.last %}
UNION ALL
{%- endif %}
{%- endfor %}
ORDER BY rank;
""")


def escape_sql_string(value):
    """Escape single quotes for safe SQL queries."""
    return value.replace("'", "''") if value else value


def get_query(text, limit=12):
    is_branded_query = 'brand_name' in text['restaurant_or_brand'].content
    is_restaurant_query = 'restaurant_name' in text['restaurant_or_brand'].content

    table = 'restaurant_menu_foods' \
            if is_restaurant_query \
            else 'branded_foods' if is_branded_query \
            else 'non_branded_foods'

    fields = ['t.description', 't.serving_size', 't.protein_amount']

    restaurant_match = ''
    brand_match = ''

    if is_restaurant_query:
        restaurant_match = text['restaurant_or_brand'].content.replace(
            'restaurant_name: ', '')
        restaurant_match = escape_sql_string(
            restaurant_match)  # Escape apostrophes
        fields.append('t.restaurant')

    if is_branded_query:
        brand_match = text['restaurant_or_brand'].content.replace(
            'brand_name: ', '')
        brand_match = escape_sql_string(brand_match)  # Escape apostrophes
        fields.append('t.brand_name')

    queries = []
    fields = ', '.join(fields)

    food_items = re.sub(r'[\[\]\"\']', '', text['food_items'].content)
    food_items = food_items.split(',')
    for item in food_items:
        item = item.replace(brand_match, '')
        item = item.replace(restaurant_match, '')
        item = escape_sql_string(item.strip())  # Escape food item names too
        if item:
            queries.append(query_block_template.render(
                fields=fields,
                table=table,
                description=item.split(' '),
                brand_match=brand_match,
                restaurant_match=restaurant_match,
                limit=limit
            ))

    final_query = final_query_template.render(
        queries=queries,
        limit=limit
    )

    retrieval_text = {}
    retrieval_text['food_items'] = text['food_items'].content
    if is_restaurant_query:
        retrieval_text['restaurant'] = text['restaurant_or_brand'].content
    elif is_branded_query:
        retrieval_text['brand'] = text['restaurant_or_brand'].content

    return final_query, retrieval_text
