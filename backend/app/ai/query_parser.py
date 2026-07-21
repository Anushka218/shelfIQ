from langchain_core.prompts import ChatPromptTemplate

from app.ai.llm import get_llm
from app.ai.prompts import QUERY_PARSER_PROMPT
from app.ai.schemas import ParsedQuery

llm = get_llm()

structured_llm = llm.with_structured_output(ParsedQuery)

prompt = ChatPromptTemplate.from_template(QUERY_PARSER_PROMPT)

query_parser_chain = prompt | structured_llm

def parse_search_query(query: str) -> ParsedQuery:
        return query_parser_chain.invoke({
        "query": query
        })