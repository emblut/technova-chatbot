import {
  RunnableSequence,
  RunnablePassthrough,
  RunnableBranch,
} from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatOllama } from '@langchain/ollama';

import { retrieveDocuments } from '../service/setupRetrieve.mjs';

import {
  answerQuestionTemplate,
  notRelatedToPurposeAnswerTemplate,
  classifyQuestionRelevanceTemplate,
} from './promptTemplates.mjs';

const llm = new ChatOllama({
  model: 'llama3.1:8b',
});

function combineDocuments(docs) {
  return docs.map((doc) => doc.pageContent).join('\n\n');
}

const classifyQuestionRelavanceChain = RunnableSequence.from([
  classifyQuestionRelevanceTemplate,
  llm,
  new StringOutputParser(),
]);

const retrieveDocumentsChain = RunnableSequence.from([
  (data) => {
    return data.originalQuestion.question;
  },
  retrieveDocuments,
  combineDocuments,
]);

const answerQuestionChain = RunnableSequence.from([
  answerQuestionTemplate,
  llm,
  new StringOutputParser(),
]);

const relevantQuestionChain = RunnableSequence.from([
  {
    context: retrieveDocumentsChain,
    question: ({ originalQuestion }) => originalQuestion.question,
    prevMessages: ({ originalQuestion }) => originalQuestion.prevMessages,
  },
  answerQuestionChain,
]);

const notRelatedToPurposeAnswerChain = RunnableSequence.from([
  notRelatedToPurposeAnswerTemplate,
  llm,
  new StringOutputParser(),
]);

const irrelevantQuestionChain = RunnableSequence.from([
  {
    question: ({ originalQuestion }) => originalQuestion.question,
    prevMessages: ({ originalQuestion }) => originalQuestion.prevMessages,
  },
  notRelatedToPurposeAnswerChain,
]);

const answerChain = RunnableBranch.from([
  // Om frågan är relevant till chatbotens syfte
  [
    (input) => input.questionRelevance.toLowerCase() === 'ja',
    relevantQuestionChain,
  ],
  //annars kör vi denna kedja
  irrelevantQuestionChain,
]);

export const chain = RunnableSequence.from([
  {
    originalQuestion: new RunnablePassthrough(),
    questionRelevance: classifyQuestionRelavanceChain,
  },
  answerChain,
]);
