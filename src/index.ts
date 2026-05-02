import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod"; // SDK использует Zod для валидации аргументов

// 1. Создаем инстанс сервера
const server = new McpServer({
  name: "MyFirstMCP",
  version: "1.0.0"
});

// 2. Добавляем "Инструмент" (Tool), который сможет вызывать ИИ
server.tool(
  "calculate_tax",
  "Calculate Bulgaria B2B tax (approx 15% loss)",
  {
    amount: z.number().describe("The gross amount in Euros")
  },
  async ({ amount }) => {
    // Твоя логика (мы берем сумму и отнимаем 15%)
    const netAmount = amount * 0.85;
    
    // Возвращаем результат ИИ в нужном формате
    return {
      content: [{ type: "text", text: `Net amount after 15% tax: ${netAmount} EUR` }]
    };
  }
);

// 3. Запускаем сервер через stdio (стандартный ввод-вывод)
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server is running on stdio"); // Важно: пишем логи в stderr, а не stdout!
}

run().catch(console.error);
