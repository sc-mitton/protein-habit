import os
from sqlalchemy.orm import Session
from sqlalchemy import text
from dotenv import load_dotenv
from langchain_community.utilities import SQLDatabase
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableLambda, RunnableParallel
from langchain_core.output_parsers import JsonOutputParser
from fastapi import Depends
from db.comp_food_database import engine

from db.comp_food_database import get_db
from rags.protein_amount.retrieval import (
    get_restaurant_or_brand_prompt,
    food_items_prompt,
    get_query
)
from rags.protein_amount.generation import generation_prompt
from utils.get_secret import get_secret

OPENAI_API_KEY = get_secret("OPENAI_API_KEY")

environment = os.getenv('ENVIRONMENT', 'dev')
load_dotenv(f'.env.{environment}')

# Initialize OpenAI clients
llm4omini1 = ChatOpenAI(model="gpt-4o-mini", temperature=0.0,
                        openai_api_key=OPENAI_API_KEY)
llm4omini2 = ChatOpenAI(model="gpt-4o-mini", temperature=0.0,
                        openai_api_key=OPENAI_API_KEY)

db = SQLDatabase(
    engine,
    include_tables=[
        'restaurant_menu_foods',
        'restaurant_menu_foods_fts',
        'branded_foods',
        'branded_foods_fts',
        'non_branded_foods',
        'non_branded_foods_fts'
    ])


def run(input: str, conn: Session = Depends(get_db)):
    # Step 1: Retrieve necessary data from the database

    retrieval_chain = RunnableParallel(
        restaurant_or_brand=get_restaurant_or_brand_prompt | llm4omini1,
        food_items=food_items_prompt | llm4omini2
    ) | RunnableLambda(get_query)

    query, retrieval_text = retrieval_chain.invoke({'text': input})
    result = conn.execute(text(query))
    data = [
        tuple(result.keys()),
        *result.fetchall()
    ]

    # Step 2: Generate the response with augmented data
    generation_chain = generation_prompt | llm4omini2 | JsonOutputParser()
    response = generation_chain.invoke(
        {'data': data, 'text': retrieval_text, 'original_input': input})

    return response
