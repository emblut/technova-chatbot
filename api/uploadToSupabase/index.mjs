import { readFile } from 'fs/promises';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase';
import { OllamaEmbeddings } from '@langchain/ollama';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY;

try {
  const text = await readFile(`${process.cwd()}/policy.txt`, 'utf-8');

  const text_splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: [
      '/n/n',
      '/n',
      ' ',
      '',
      '. ',
      '1. ',
      '2. ',
      '3. ',
      '4. ',
      '5. ',
      '6. ',
      '7. ',
      '8. ',
      '9. ',
    ],
    chunkOverlap: 50,
  });
  const splittedText = await text_splitter.createDocuments([text]);

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

  await SupabaseVectorStore.fromDocuments(
    splittedText,
    new OllamaEmbeddings({ model: 'llama3.1:8b' }),
    { client: supabaseClient, tableName: 'documents' }
  );
} catch (error) {
  console.log(error);
}
