export const javascriptSamples = [
  {
    id: 'js-promise-all',
    title: 'Promise.all with Progress',
    description: 'Execute multiple promises in parallel with progress tracking',
    category: 'Async',
    language: 'javascript',
    code: `async function executeWithProgress(promises, onProgress) {
  const total = promises.length;
  let completed = 0;

  const wrappedPromises = promises.map(promise => 
    promise.then(result => {
      completed++;
      onProgress(completed / total * 100);
      return result;
    })
  );

  return Promise.all(wrappedPromises);
}

// Example usage
const tasks = [
  fetch('/api/data1'),
  fetch('/api/data2'),
  fetch('/api/data3')
];

executeWithProgress(tasks, progress => {
  console.log(\`Progress: \${progress}%\`);
}).then(results => {
  console.log('All tasks completed:', results);
});`
  },
  {
    id: 'js-debounce',
    title: 'Debounce Function',
    description: 'Implement a debounce utility for rate limiting function calls',
    category: 'Utilities',
    language: 'javascript',
    code: `function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Example usage
const handleSearch = debounce((searchTerm) => {
  // Perform search operation
  console.log('Searching for:', searchTerm);
}, 300);

// Call it multiple times
handleSearch('test');
handleSearch('test2');
// Only the last call will be executed after 300ms`
  },
  {
    id: 'js-observer',
    title: 'Observer Pattern',
    description: 'Implementation of the Observer design pattern',
    category: 'Patterns',
    language: 'javascript',
    code: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.events.has(event)) return;
    const callbacks = this.events.get(event);
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.events.has(event)) return;
    this.events.get(event).forEach(callback => callback(data));
  }
}

// Example usage
const store = new EventEmitter();

// Subscribe to events
const unsubscribe = store.on('userUpdated', user => {
  console.log('User updated:', user);
});

// Emit events
store.emit('userUpdated', { id: 1, name: 'John' });

// Unsubscribe
unsubscribe();`
  },
  {
    id: 'js-proxy',
    title: 'Proxy Pattern',
    description: 'Using JavaScript Proxy for object validation',
    category: 'Patterns',
    language: 'javascript',
    code: `function createValidator(validations) {
  return {
    get(target, property) {
      return target[property];
    },
    set(target, property, value) {
      const validation = validations[property];
      if (validation) {
        const result = validation(value);
        if (result !== true) {
          throw new Error(\`Invalid value for \${property}: \${result}\`);
        }
      }
      target[property] = value;
      return true;
    }
  };
}

// Example usage
const user = new Proxy({}, createValidator({
  age: value => {
    if (typeof value !== 'number') return 'Age must be a number';
    if (value < 0 || value > 120) return 'Age must be between 0 and 120';
    return true;
  },
  email: value => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email format';
    return true;
  }
}));

try {
  user.age = 25; // Works fine
  user.email = 'invalid-email'; // Throws error
} catch (error) {
  console.error(error.message);
}`
  },
  {
    id: 'js-iterator',
    title: 'Custom Iterator',
    description: 'Implementing the Iterator pattern in JavaScript',
    category: 'Patterns',
    language: 'javascript',
    code: `class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i += this.step) {
      yield i;
    }
  }

  map(fn) {
    return [...this].map(fn);
  }

  filter(fn) {
    return [...this].filter(fn);
  }

  reduce(fn, initial) {
    return [...this].reduce(fn, initial);
  }
}

// Example usage
const range = new Range(1, 10, 2);

// Using for...of
for (const num of range) {
  console.log(num); // 1, 3, 5, 7, 9
}

// Using iterator methods
const doubled = range.map(x => x * 2);
const evens = range.filter(x => x % 2 === 0);
const sum = range.reduce((acc, x) => acc + x, 0);`
  },
  {
    id: 'js-decorator',
    title: 'Method Decorator',
    description: 'Creating method decorators for logging and performance monitoring',
    category: 'Patterns',
    language: 'javascript',
    code: `function log(target, name, descriptor) {
  const original = descriptor.value;

  descriptor.value = function(...args) {
    console.log(\`Calling \${name} with arguments: \${JSON.stringify(args)}\`);
    const result = original.apply(this, args);
    console.log(\`Method \${name} returned: \${JSON.stringify(result)}\`);
    return result;
  };

  return descriptor;
}

function measure(target, name, descriptor) {
  const original = descriptor.value;

  descriptor.value = function(...args) {
    const start = performance.now();
    const result = original.apply(this, args);
    const end = performance.now();
    console.log(\`\${name} took \${end - start}ms to execute\`);
    return result;
  };

  return descriptor;
}

class Calculator {
  @log
  @measure
  add(a, b) {
    return a + b;
  }

  @log
  @measure
  fibonacci(n) {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

// Example usage
const calc = new Calculator();
calc.add(2, 3);
calc.fibonacci(10);`
  }
];