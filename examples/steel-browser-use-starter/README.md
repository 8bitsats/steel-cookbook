# Steel Browser Use Example

This example demonstrates how to integrate Steel with the [browser-use](https://github.com/browser-use/browser-use) framework to create an AI agent capable of interacting with web browsers. It leverages Steel's session management to provide a secure, cloud-based browser instance for browser-use to connect to.

## Features

- Seamless integration between Steel and browser-use
- Cloud-based browser automation with Steel sessions
- AI-powered browser interaction using OpenAI GPT-4
- Automatic cleanup of resources
- Robust error handling and session management

## Prerequisites

- Python 3.11 or higher
- Python package manager (Recommended `uv`: `pip install uv`)
- Steel API key (Get 100 free browser hours [here.](https://app.steel.dev/sign-up))
- OpenAI API key

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/steel-dev/steel-cookbook.git
   cd steel-cookbook/examples/steel-browser-use-starter
   ```

2. **Create and activate a virtual environment with venv:**

   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows, use: .venv\Scripts\activate
   ```

3. **Install the required dependencies using venv:**

   ```bash
   pip install .
   ```

   Note: We're using venv to manage our environment and pip to install the packages. This ensures all dependencies are resolved consistently using pip's dependency resolution. If you're having issue with speed or dependencies, feel free to switch back to python/pip and try these steps again.

4. **Copy the environment variables file and configure your API keys:**

   ```bash
   cp .env.example .env
   ```

5. **Edit the `.env` file and add your API keys:**

   ```env
   STEEL_API_KEY=your_steel_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

Run the example with:

```bash
python main.py
```

The script will:

1. Create a new Steel session
2. Connect browser-use to the Steel session using the WebSocket URL
3. Execute the AI agent's task (e.g., summarizing the Steel Docs changelog)
4. Automatically clean up resources when done

## How It Works

1. **Session Creation**: The script creates a Steel session with optional proxy and CAPTCHA-solving capabilities.

2. **Browser Integration**: The WebSocket URL from the Steel session is passed to browser-use's Browser configuration.

3. **AI Agent Setup**: A browser-use Agent is created with:

   - The specified task
   - OpenAI GPT-4 language model
   - Browser instance connected to Steel

4. **Execution**: The agent runs autonomously, performing the specified task.

5. **Cleanup**: Resources are properly released, including:
   - Closing the browser connection process
   - Releasing the Steel session

## Error Handling

The example includes comprehensive error handling:

- Validation of required environment variables
- Try/except blocks for session management
- Proper cleanup in case of failures
- Informative error messages

## Customization

You can modify the example by:

1. Changing the task in `main.py`
2. Adjusting Steel session parameters
3. Configuring different browser-use settings
4. Using a different OpenAI model or adjusting model parameters

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

This example is part of the Steel Cookbook and is licensed under the MIT License. See the LICENSE file for details.

## Real-Time Agent Visualization Dashboard

A React dashboard is included in the `dashboard/` directory. It connects to the agent's WebSocket server and visualizes tokens, meta info, and agent status in real time. You can also send new tasks or questions to the agent from the dashboard UI.

### To run the dashboard:

1. Open a new terminal and navigate to the dashboard directory:
   ```bash
   cd dashboard
   npm install
   npm start
   ```
   This will start the dashboard at http://localhost:3000

2. Make sure the Python agent is running (see above). The dashboard will connect to the agent's WebSocket server at ws://localhost:8000.

3. Use the dashboard UI to view discovered tokens, agent status, and meta info in real time. You can also set new tasks or ask questions to the agent directly from the dashboard.

---
