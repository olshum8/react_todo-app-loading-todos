/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { addTodos, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoForm } from './components/TodoForm';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [renderCount, setRenderCount] = useState(0);

  const increaseCounter = () => {
    setRenderCount(prevCount => prevCount + 1);
  };

  const addTodo = async (todo: Todo): Promise<void> => {
    try {
      const newTodo = await addTodos(todo);

      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      setErrorMessage('Unable to add a todo');
      throw error;
    }
  };

  useEffect(() => {
    let filteredTodos: Todo[];

    getTodos()
      .then(todosFromServer => {
        switch (filter) {
          case 'active':
            filteredTodos = todosFromServer.filter(
              todo => todo.completed === false,
            );
            break;
          case 'completed':
            filteredTodos = todosFromServer.filter(
              todo => todo.completed === true,
            );
            break;
          default:
            filteredTodos = todosFromServer;
            break;
        }

        setTodos(filteredTodos);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, [filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoForm
            todos={todos}
            onAddTodo={addTodo}
            handleError={setErrorMessage}
            increaseCounter={increaseCounter}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TodoList todos={todos} />
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && <Footer onFilter={setFilter} />}
      </div>

      <ErrorMessage renderCounter={renderCount} errorMessage={errorMessage} />
    </div>
  );
};
