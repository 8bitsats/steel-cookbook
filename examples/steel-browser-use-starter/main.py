"""
Steel Browser Use Starter Template
Integrates Steel with browser-use framework to create an AI agent for web interactions.
Requires STEEL_API_KEY & OPENAI_API_KEY in .env file.
"""

import os
import asyncio
import websockets
import json
from dotenv import load_dotenv
from steel import Steel
from langchain_openai import ChatOpenAI
from browser_use import Agent
from browser_use.browser.browser import Browser, BrowserConfig
from browser_use.browser.context import BrowserContext

# 1. Initialize environment and clients
load_dotenv()

# Get API keys
STEEL_API_KEY = os.getenv('STEEL_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not STEEL_API_KEY or not OPENAI_API_KEY:
    raise ValueError(
        'STEEL_API_KEY and OPENAI_API_KEY must be set in .env file')

# Initialize Steel client and create session
client = Steel(steel_api_key=STEEL_API_KEY)


# 2. Create a Steel session to get a remote browser instance for your browser-use agent.
print("Creating Steel session...")
session = client.sessions.create(
    # Uncomment and configure as needed:
    # use_proxy=True,
    # solve_captcha=True,
    # session_timeout=1800000,
    # user_agent='MyCustomUserAgent/1.0',
)

print(f"\033[1;93mSteel Session created!\033[0m\n"
      f"View session at \033[1;37m{session.session_viewer_url}\033[0m\n")


# 3.  Define Your Browser and Browser Context with Steel's CDP URL

cdp_url = f"wss://connect.steel.dev?apiKey={STEEL_API_KEY}&sessionId={session.id}"
browser = Browser(config=BrowserConfig(cdp_url=cdp_url))
browser_context = BrowserContext(browser=browser)


# 4. Configure the browser-use agent

# Create a ChatOpenAI model for agent reasoning
# You can use any browser-use compatible model you want here like Anthropic, Deepseek, Gemini, etc.
# See supported models here: https://docs.browser-use.com/customize/supported-models
model = ChatOpenAI(
    model="gpt-4o",
    temperature=0.3,
    api_key=OPENAI_API_KEY
)

# The agent's main instruction
task = """
Go to https://letsbonk.fun. 
1. Extract the meta title and meta description of the page.
2. Find and list 10 tokens that are available to buy on the site. For each token, provide its name and any available details (such as symbol, price, or description).
Return your findings in a clear, structured format.
"""

# Instantiate the agent
agent = Agent(
    task=task,
    llm=model,
    browser=browser,
    browser_context=browser_context,
)

# --- WebSocket Server Setup ---
connected_clients = set()
agent_state = {
    "status": "Idle",
    "meta": {"title": "", "description": ""},
    "tokens": [],
    "current_task": task
}

async def broadcast(data):
    if connected_clients:
        message = json.dumps(data)
        await asyncio.gather(*(client.send(message) for client in connected_clients))

async def handle_client(websocket, path):
    connected_clients.add(websocket)
    try:
        # Send initial state
        await websocket.send(json.dumps({"type": "status", "message": agent_state["status"]}))
        await websocket.send(json.dumps({"type": "meta", **agent_state["meta"]}))
        await websocket.send(json.dumps({"type": "tokens", "tokens": agent_state["tokens"]}))
        async for message in websocket:
            try:
                data = json.loads(message)
                if data.get("type") == "set_task":
                    agent_state["current_task"] = data["task"]
                    agent_state["status"] = f"New task set: {data['task']}"
                    await broadcast({"type": "status", "message": agent_state["status"]})
                    # Optionally, trigger your agent to start the new task here
                elif data.get("type") == "ask":
                    question = data["question"]
                    await broadcast({"type": "status", "message": f"Received question: {question}"})
                    # Optionally, process the question and respond
            except Exception as e:
                await websocket.send(json.dumps({"type": "error", "message": str(e)}))
    finally:
        connected_clients.remove(websocket)

async def start_ws_server():
    server = await websockets.serve(handle_client, "localhost", 8000)
    print("WebSocket server started on ws://localhost:8000")
    await server.wait_closed()

# --- Agent update hooks ---
async def agent_found_token(token):
    agent_state["tokens"].append(token)
    await broadcast({"type": "token", "token": token})

async def agent_found_meta(meta):
    agent_state["meta"] = meta
    await broadcast({"type": "meta", **meta})

async def agent_status_update(status):
    agent_state["status"] = status
    await broadcast({"type": "status", "message": status})

# 5. Run the agent and handle cleanup

async def main():
    ws_task = asyncio.create_task(start_ws_server())
    try:
        # Example: send initial status
        await agent_status_update("Agent starting...")
        await agent_found_meta({"title": "", "description": ""})
        await agent_found_token({"name": "", "symbol": "", "marketCap": 0, "price": 0})
        # --- Your agent logic here ---
        await agent.run()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        if browser:
            await browser.close()
        if session:
            client.sessions.release(session.id)
        print("Done")
        ws_task.cancel()

if __name__ == '__main__':
    asyncio.run(main())
