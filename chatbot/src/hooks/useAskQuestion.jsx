import { useState } from 'react';

const API_URL = 'http://localhost:3000/api/ask';

export function useAskQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function askQuestion(question, prevMessages) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ question, prevMessages }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const { answer } = await response.json();
      return answer;
    } catch (error) {
      console.log(error);

      setError(error.message || 'Kunde inte få ett svar, försök igen senare.');
      return error;
    } finally {
      setLoading(false);
    }
  }

  return { askQuestion, loading, error };
}
