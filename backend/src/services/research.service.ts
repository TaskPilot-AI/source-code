import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor } from "langchain/agents";
import { BaseMessageChunk } from "@langchain/core/messages";
import type { AgentAction, AgentFinish } from "@langchain/core/agents";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { SearxngSearch } from "@langchain/community/tools/searxng_search";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import prisma from "../db";
import dotenv from "dotenv";
dotenv.config();

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash-001",
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "dummy-key",
  temperature: 1,
});

// Initialize the search tool
const tools = [
  new SearxngSearch({
    apiBase: process.env.SEARCH_API_BASE,
    params: {
      format: "json",
      engines: "google, github",
    },
    headers: {},
  }),
];
const prefix = ChatPromptTemplate.fromMessages([
  [
    "ai",
    "Answer the following questions as best you can. In your final answer, use a bulleted list markdown format.",
  ],
  ["human", "{input}"],
]);
// Create the agent
const customOutputParser = (
  input: BaseMessageChunk
): AgentAction | AgentFinish => ({
  log: "test",
  returnValues: {
    output: input,
  },
});

export const searchInternet = async (query: string, adminId: string) => {
  if (!query || query.trim() === "") {
    throw new Error("A valid search query is required");
  }
  if (!adminId || adminId.trim() === "") {
    throw new Error("A valid admin ID is required");
  }

  // Get the admin with both limit and lastResetDate
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      remainingResearchLimit: true,
      lastLimitResetDate: true,
      dailyResearchLimit: true,
      subscription: true,
    },
  });

  if (!admin) {
    throw new Error("Admin not found");
  }
  // if (
  //   admin.subscription?.planId === "pro" &&
  //   (admin.subscription?.status === "pending" ||
  //     admin.subscription?.status === "cancelled")
  // ) {
  //   throw new Error("Subscription is pending");
  // }
  // Check if we need to reset the limit (it's a new day)
  // const today = new Date();
  // today.setHours(0, 0, 0, 0); // Set to start of day for comparison

  // const lastReset = admin.lastLimitResetDate
  //   ? new Date(admin.lastLimitResetDate)
  //   : null;
  // const needsReset = !lastReset || lastReset < today;

  // // Reset the limit if it's a new day
  // if (needsReset) {
  //   await prisma.admin.update({
  //     where: { id: adminId },
  //     data: {
  //       remainingResearchLimit: admin.dailyResearchLimit,
  //       lastLimitResetDate: new Date(),
  //     },
  //   });

  //   // Update local admin object to reflect the reset
  //   admin.remainingResearchLimit = admin.dailyResearchLimit;
  // }

  // // Now check if the admin has reached their research limit
  // if (admin.remainingResearchLimit <= 0) {
  //   throw new Error("Daily research limit reached. Please try again tomorrow.");
  // }

  try {
    // Replace this placeholder agent with your actual implementation.
    const agent = RunnableSequence.from([prefix, llm, customOutputParser]);
    const executor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
    });

    const result = await executor.invoke({ input: query });

    // if (admin.subscription?.planId != "pro") {
    //   await prisma.admin.update({
    //     where: { id: adminId },
    //     data: {
    //       remainingResearchLimit: admin.remainingResearchLimit - 1,
    //     },
    //   });
    // }
    return {
      results: result,
      query: query,
      // remainingSearches: admin.remainingResearchLimit - 1,
    };
  } catch (error) {
    console.error("Error searching the internet:", error);
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
    }
    throw new Error(
      `Search failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
