- LLM
- Vector DB/DB /AP --> RAG
- Tools  
         --  (they are like micro service that can be a specific service - getProductDataById, getWeatherByZipcode, getRestautantsByLatitutudeAndLongitudude)
- Memory
- Context
- prompt (system/user)
- ASSITANT (LLM response)


### AGENT (LLM + Tools + Memory)

- Local AGENT ( an agent within a Application)
- REMOTE AGENT ( an agent which is pre-built and availble to use as a service)
- MCP ( is one of Remote agent which exposes Tools of that particular service)


## traditional application 
- -> a  pure traditional application with no LLMS 
## LLM application 
- -> an Application which has access to LLM and to answer/summarize few questions, it integrates with LLM and acts on the LLM response (No tools)
## LLM with webserach tool application 
- -> an Application which has access to LLM and to answer/summarize few questions, it integrates with LLM and Websearch tool and acts on the LLM response (Web search tool access via LLM)

## Agent application 

-> an application which has  Agent code ( LLM + tools + memory)  to answer questions 
**note** : when tools are attached to an agent (say Product tool : look up on product by product-id, list all products by category, list the products by description/search criteria, products sold in Stores/digital)
based on the user query and Tools attached in the prompt, LLM decides what tools to be called to fetch the data  via Tools and  then respond back

## Multi Agent application 

-> an application which has  many Agents configured to answer questions 

- Agent 1 : Product agent
- Agent 2 : Inventory agent
- Agent 3 : Customer agent
- Agent 4 : Order agent
- Agent 5 : Main Agent/ Supervisor Agent (has access to all the 4 agents  :  Product agent, Inventory agent, Customer agent, Order agent)


this multi-agent has 4 agents configured and based on the user query ... 
supervisor agent (main agent) interprets the request and then decides to call nexeccary/appropriate agent to get the results)

here, based on the query, 

1> main/supervisor agent  may go to one agent only if the answer can be framed based on that that agent response ( say :  details of product id : 'p123')

2> main/supervisor agent may interact with multiple agents ( say : did the customer : 'john.doe@gmail.com` purchase any product 'RED iPhone 17 256GB` in recent past of 2 weeks)
  (Customer agent call ) customer : 'john.doe@gmail.com` exists -> Goto Customer Agent

**next**

(product agent call)  Product_desc : 'RED iphone 17 256GB` exists ->  Goto product Agent

**next**

(Order agent call) check for all orders purchased by customer_id = cust1234 (based on customer agent response with-in 2 weeks as per th user criertia)

**next**

based on all above product response having product_ids and order response, filter out the orders where product_ids match and customer_id match

finally returns back the customer : {customer info} + products : [{product data }] + orders : [{Order data}]

as an improvement, if needed customer call and product call could be parallel call


if the main application has build all the agents then there is no remote agents 

if the main application need to integarte with speicalized agents ( say customer agent, order agent which are  remote agents hosted) then remote agent comminication need to be created



A2A is google remote agent protocal to comminicate between remote agent . it has Agent card. agent skiils, Agent executor, Message (input), Artifact (output)


Agent application need Agent orchetrator code such as Google ADK, Langchain, Langgraph, Spring AI or Ai agent work flow (n8n, DIFY and Others)

- Langchain
- Langgraph
- Spring AI
- Langchain4j
- ADK
- A2A
- ADK web UI (Dev)
- n8n
- DIFY
- LLM 
- Tools
- memory management
- Session management
- context management
- LLM interaction  loggers


### RAG ( retrival Augment generation)

- LLM has no access to eneterprise  data
- an Application need access internal enterprise data and then get it summarized with LLM then RAG places a role
- Most of the cases RAG would be using with Vector DB, if not they can have tool access to connect to DB or API

#### Vector DB would vectorized embeeded data
- to store data into vector, documents (files, PDF, Xcel spreadsheets, CSV, docs) would be broken into chunks and then vectorized using LLM embedding model and embedding would be stored in vector Db along with meta data)
- to search on the data (sematic search ) user querys would also be vectorized (embed) using same LLM embedding model and then query with-in vector DB and then fectch the matching score results ( higher the score is beter say above >0.7) and using this vector result + original prompt is sent to LLM  ... LLM responds back with results based question and augmneted (vector results as additional context)

**Vector DB** 
- Qdrant, pinecone, PGVector, MongoDB vector, FIAS, chromaDB others 

**note :** 
 an Agent with RAG can be implemented as a specialist and this can be attached as a sub-agent to the Agent
