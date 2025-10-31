import './App.css';
import { useRef, useState } from 'react';

import { useAskQuestion } from './hooks/useAskQuestion';

import Message from './components/Message';
import Loading from './components/Loading';

function App() {
  const inputRef = useRef();
  const [messages, setMessages] = useState([]);
  const { askQuestion, loading, error } = useAskQuestion();

  function addMessage(role, content) {
    setMessages((prev) => [...prev, { role, content }]);
    console.log(messages);
  }

  async function sendAnswer(event) {
    event.preventDefault();

    if (event.type === 'click' || event.key === 'Enter') {
      const question = inputRef.current.value;
      inputRef.current.value = '';

      addMessage('user', question);

      const answer = await askQuestion(question, messages);

      addMessage('assistant', answer);
    }
  }

  const messageComponents = messages.map((message, index) => {
    return (
      <Message content={message.content} role={message.role} key={index} />
    );
  });

  return (
    <main className='chat'>
      <section className='chat__messages'>
        {messageComponents}
        {loading ? <Loading /> : ''}
        {error ? <p>{error}</p> : ''}
      </section>
      <form className='chat__form'>
        <input type='text' ref={inputRef} />
        <button onClick={sendAnswer} onKeyUp={sendAnswer}>
          Fråga
        </button>
      </form>
    </main>
  );
}

export default App;
