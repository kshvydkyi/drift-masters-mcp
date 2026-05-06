# 🏁 Drift Masters MCP Server

An AI-native backend service built with Node.js, Prisma, and the **Model Context Protocol (MCP)**.

This project allows AI assistants (like Cursor, Claude Desktop, or custom LLM agents) to act as autonomous managers for a drifting championship. Instead of giving the AI dangerous raw SQL access, this server provides a scalable "Tool Registry" with strict business-logic functions (CRUD) and Zod validation.

## 🚀 Features

- **MCP Protocol Integration:** Connects seamlessly with AI assistants via `stdio` transport.
- **Scalable Architecture:** Built similar to NestJS/Express controllers. Uses a centralized `Tool Registry` instead of bloated `switch/if` statements.
- **Strict Validation:** All tool arguments are validated at runtime using **Zod** schemas.
- **Prisma ORM & PostgreSQL:** Strongly typed database access with relational models (Pilots, Cars, Events, Qualifications, Battles).
- **Isolated Integration Tests:** Automated test suite using **Jest** running against a dedicated Dockerized test database.
- **Universal Query Tool:** Includes a read-only dynamic Prisma querying tool, allowing the AI to safely fetch complex relations on the fly.

## 📂 Project Structure

```text
├── src/
│   ├── index.ts              # MCP Server entry point & stdio setup
│   ├── db.ts                 # Prisma Client initialization
│   ├── __tests__/            # Jest integration tests
│   └── tools/                # Business logic tools (Controllers)
│       ├── schemas/          # Zod validation schemas
│       ├── index.ts          # Tool Registry exported for the server
│       ├── createPilot.ts    # Example: Tool for pilot creation
│       └── queryDatabase.ts  # Example: Universal read-only query tool
├── prisma/
│   ├── schema.prisma         # Database models
│   └── seed.ts               # Initial database population script
├── docker-compose.yml        # Dev and Test databases
└── package.json
```

## 🛠️ Installation & Setup

**1. Clone repo and install dependencies:**

```bash
npm install
```

**2. Start PostgreSQL databases (dev + test):**

```bash
npm run db:up
```

**3. Configure Environment Variables:**
Rename `.env.example` to `.env` and `.env.test.example` to `.env.test`.
_(Ensure they point to the correct Docker ports, e.g., 5432 for dev, 5433 for test)._

**4. Push schema and generate Prisma client:**

```bash
npx prisma db push
npx prisma generate
```

**5. Seed development database:**

```bash
npx tsx prisma/seed.ts
```

## 🤖 Connecting to Cursor / Claude Desktop

To use this server inside an AI assistant that supports MCP:

1. Open **Cursor Settings** -> Features -> MCP.
2. Click **+ Add new MCP server**.
3. Name it: `drift-masters-mcp`.
4. Command to run (recommended, loads `.env` explicitly):
   ```bash
   /absolute/path/to/project/node_modules/.bin/dotenv -e /absolute/path/to/project/.env -- /absolute/path/to/project/node_modules/.bin/tsx /absolute/path/to/project/src/index.ts
   ```

   Alternative (if your MCP client already injects env vars):
   ```bash
   npx tsx /absolute/path/to/your/project/src/index.ts
   ```
5. Click Save and Refresh.

Once connected, you can type natural language prompts in the AI chat, such as:

> _"Register a new pilot: James Deane. He drives a Nissan Silvia S14.5 with a 2JZ engine producing 950 horsepower."_

The AI will automatically parse your prompt, select the `create_pilot` tool, validate the arguments via Zod, and persist the data in PostgreSQL using Prisma's nested writes.

## 🧪 Testing

The project uses a separate test database to avoid corrupting development data.

Run the integration test suite:

```bash
npm run test
```

_This command automatically pushes the schema to the test database and executes the Jest suites, cleaning up tables between test runs._

Useful local commands:

```bash
npm run drift:start   # watch mode for local MCP development
npm run drift:once    # one-time MCP server start
npm run db:down       # stop databases
npm run db:reset      # recreate DB containers from scratch
```

## 👨‍💻 Author

**Kostiantyn Shvydkyi**
Full-Stack Node.js Engineer
[LinkedIn](https://www.linkedin.com/in/kostyantyn-shvydkyi-444a3b22b/) | [GitHub](https://github.com/kshvydkyi)
