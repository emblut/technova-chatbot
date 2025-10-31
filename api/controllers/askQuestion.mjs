import { chain } from '../langchain/chains.mjs';

export async function askQuestion(req, res) {
  const { question, prevMessages } = req.body;

  const answer = await chain.invoke({ question, prevMessages });

  res.json({ answer });
}
