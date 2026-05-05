import { Server } from "@modelcontextprotocol/sdk/server/index";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types";
import { toolsRegistry } from "./tools/index";

const server = new Server(
  {
    name: "drift-masters-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.values(toolsRegistry).map(({ name, description, inputSchema }) => ({
      name,
      description,
      inputSchema,
    })),
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = toolsRegistry[request.params.name];

  if (!tool) {
    return {
      content: [{ type: "text", text: `Tool not found: ${request.params.name}` }],
      isError: true,
    };
  }

  try {
    const result = await tool.handler(
      request.params.arguments as Record<string, unknown> | undefined
    );
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Tool error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Drift MCP Server is running on stdio...");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
