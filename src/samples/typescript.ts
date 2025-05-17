export const typescriptSamples = [
  {
    id: 'ts-state-machine',
    title: 'Type-Safe State Machine',
    description: 'Implementation of a strongly-typed state machine',
    category: 'Patterns',
    language: 'typescript',
    code: `type State = 'idle' | 'loading' | 'success' | 'error';
type Event = 'FETCH' | 'RESOLVE' | 'REJECT' | 'RESET';

interface StateMachine<TState, TEvent> {
  state: TState;
  transition(event: TEvent): void;
  canTransition(event: TEvent): boolean;
}

class FetchMachine implements StateMachine<State, Event> {
  private transitions: Record<State, Partial<Record<Event, State>>> = {
    idle: { FETCH: 'loading' },
    loading: {
      RESOLVE: 'success',
      REJECT: 'error'
    },
    success: { RESET: 'idle' },
    error: { RESET: 'idle', FETCH: 'loading' }
  };

  constructor(public state: State = 'idle') {}

  transition(event: Event): void {
    const nextState = this.transitions[this.state][event];
    if (!nextState) {
      throw new Error(
        \`Invalid transition: \${this.state} -> \${event}\`
      );
    }
    this.state = nextState;
  }

  canTransition(event: Event): boolean {
    return !!this.transitions[this.state][event];
  }
}

// Example usage with React
function useFetchMachine<T>(
  fetchFn: () => Promise<T>
): [T | null, Error | null, () => void] {
  const [machine] = useState(() => new FetchMachine());
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      machine.transition('FETCH');
      const result = await fetchFn();
      setData(result);
      machine.transition('RESOLVE');
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      machine.transition('REJECT');
    }
  }, [fetchFn]);

  return [data, error, fetch];
}`
  },
  {
    id: 'ts-dependency-injection',
    title: 'Dependency Injection Container',
    description: 'Building a type-safe DI container',
    category: 'Patterns',
    language: 'typescript',
    code: `type Constructor<T = any> = new (...args: any[]) => T;
type Token<T = any> = Constructor<T> | string | symbol;

class Container {
  private dependencies = new Map<Token, any>();
  private factories = new Map<Token, (...args: any[]) => any>();

  register<T>(token: Token<T>, dependency: T): void {
    this.dependencies.set(token, dependency);
  }

  registerFactory<T>(
    token: Token<T>,
    factory: (...args: any[]) => T
  ): void {
    this.factories.set(token, factory);
  }

  resolve<T>(token: Token<T>): T {
    if (this.dependencies.has(token)) {
      return this.dependencies.get(token);
    }

    if (this.factories.has(token)) {
      const factory = this.factories.get(token)!;
      return factory();
    }

    if (typeof token === 'function') {
      return this.instantiate(token);
    }

    throw new Error(\`No provider for \${String(token)}\`);
  }

  private instantiate<T>(ctor: Constructor<T>): T {
    const params = this.getConstructorParams(ctor);
    return new ctor(...params);
  }

  private getConstructorParams<T>(ctor: Constructor<T>): any[] {
    const params = Reflect.getMetadata('design:paramtypes', ctor) || [];
    return params.map((param: Constructor) => this.resolve(param));
  }
}`
  },
  {
    id: 'ts-effect-system',
    title: 'Effect System',
    description: 'Custom effect system for handling side effects',
    category: 'Advanced',
    language: 'typescript',
    code: `type Effect<T> = {
  run: () => Promise<T>;
  map: <U>(fn: (value: T) => U) => Effect<U>;
  chain: <U>(fn: (value: T) => Effect<U>) => Effect<U>;
  catch: (fn: (error: Error) => Effect<T>) => Effect<T>;
};

const Effect = {
  of: <T>(value: T): Effect<T> => ({
    run: () => Promise.resolve(value),
    map: fn => Effect.of(fn(value)),
    chain: fn => fn(value),
    catch: () => Effect.of(value)
  }),

  fail: (error: Error): Effect<never> => ({
    run: () => Promise.reject(error),
    map: () => Effect.fail(error),
    chain: () => Effect.fail(error),
    catch: fn => fn(error)
  }),

  fromPromise: <T>(promise: Promise<T>): Effect<T> => ({
    run: () => promise,
    map: fn => Effect.fromPromise(promise.then(fn)),
    chain: fn => Effect.fromPromise(promise.then(v => fn(v).run())),
    catch: fn => Effect.fromPromise(
      promise.catch(err => fn(err instanceof Error ? err : new Error(String(err))).run())
    )
  }),

  sequence: <T>(effects: Effect<T>[]): Effect<T[]> => ({
    run: () => Promise.all(effects.map(e => e.run())),
    map: fn => Effect.sequence(effects.map(e => e.map(fn))),
    chain: fn => Effect.sequence(effects.map(e => e.chain(fn))),
    catch: fn => Effect.sequence(effects.map(e => e.catch(fn)))
  })
};

// Example usage
interface User {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  userId: string;
}

const fetchUser = (id: string): Effect<User> =>
  Effect.fromPromise(
    fetch(\`/api/users/\${id}\`).then(r => r.json())
  );

const fetchUserPosts = (userId: string): Effect<Post[]> =>
  Effect.fromPromise(
    fetch(\`/api/users/\${userId}/posts\`).then(r => r.json())
  );

const getUserWithPosts = (userId: string): Effect<{ user: User; posts: Post[] }> =>
  fetchUser(userId).chain(user =>
    fetchUserPosts(userId).map(posts => ({
      user,
      posts
    }))
  ).catch(error =>
    Effect.fail(new Error(\`Failed to fetch user data: \${error.message}\`))
  );

// Using the effect system
getUserWithPosts("123")
  .map(({ user, posts }) => ({
    username: user.name,
    postCount: posts.length
  }))
  .run()
  .then(result => console.log(result))
  .catch(error => console.error(error));`
  },
  {
    id: 'ts-reactive-store',
    title: 'Reactive Store',
    description: 'Implementation of a reactive state management system',
    category: 'State Management',
    language: 'typescript',
    code: `type Subscriber<T> = (value: T) => void;
type Unsubscribe = () => void;

class Store<T> {
  private subscribers = new Set<Subscriber<T>>();
  private state: T;

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(newState: T): void {
    this.state = newState;
    this.notify();
  }

  update(fn: (state: T) => T): void {
    this.setState(fn(this.state));
  }

  subscribe(subscriber: Subscriber<T>): Unsubscribe {
    this.subscribers.add(subscriber);
    subscriber(this.state);

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notify(): void {
    for (const subscriber of this.subscribers) {
      subscriber(this.state);
    }
  }
}

// Derived store that depends on other stores
class DerivedStore<T, U> extends Store<U> {
  constructor(
    store: Store<T>,
    selector: (state: T) => U
  ) {
    super(selector(store.getState()));

    store.subscribe(state => {
      this.setState(selector(state));
    });
  }
}

// Example usage
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: TodoItem[];
  filter: 'all' | 'active' | 'completed';
}

const todoStore = new Store<TodoState>({
  items: [],
  filter: 'all'
});

const filteredTodos = new DerivedStore(
  todoStore,
  state => state.items.filter(item => {
    switch (state.filter) {
      case 'active':
        return !item.completed;
      case 'completed':
        return item.completed;
      default:
        return true;
    }
  })
);

// React hook for using stores
function useStore<T>(store: Store<T>): T {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(setState);
  }, [store]);

  return state;
}

// Example React component
function TodoList() {
  const todos = useStore(filteredTodos);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => {
              todoStore.update(state => ({
                ...state,
                items: state.items.map(item =>
                  item.id === todo.id
                    ? { ...item, completed: !item.completed }
                    : item
                )
              }));
            }}
          />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}`
  }
];