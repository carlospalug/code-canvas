export const pythonSamples = [
  {
    id: 'python-decorator',
    title: 'Python Decorator Pattern',
    description: 'Implementation of function decorators with parameters',
    category: 'Patterns',
    language: 'python',
    code: `def retry(max_attempts=3, delay=1):
    """Retry a function if it fails, with exponential backoff."""
    import time
    from functools import wraps

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempts += 1
                    if attempts == max_attempts:
                        raise e
                    wait_time = delay * (2 ** (attempts - 1))
                    time.sleep(wait_time)
            return None
        return wrapper
    return decorator

@retry(max_attempts=3, delay=1)
def fetch_data(url):
    """Example function that might fail."""
    import requests
    response = requests.get(url)
    response.raise_for_status()
    return response.json()`
  },
  {
    id: 'python-context-manager',
    title: 'Custom Context Manager',
    description: 'Create a custom context manager for resource management',
    category: 'Patterns',
    language: 'python',
    code: `class DatabaseConnection:
    def __init__(self, host, port, database):
        self.host = host
        self.port = port
        self.database = database
        self.conn = None
    
    def __enter__(self):
        """Set up the database connection"""
        print(f"Connecting to {self.database} at {self.host}:{self.port}")
        self.conn = self.connect()
        return self.conn
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Close the connection and handle any errors"""
        if self.conn:
            print("Closing database connection")
            self.conn.close()
        
        if exc_type:
            print(f"Error occurred: {exc_val}")
            # Return True to suppress the exception
            # Return False or None to propagate it
            return False
    
    def connect(self):
        """Simulate database connection"""
        return type('Connection', (), {
            'close': lambda: None,
            'execute': lambda query: print(f"Executing: {query}")
        })

# Usage example
with DatabaseConnection('localhost', 5432, 'mydb') as db:
    db.execute("SELECT * FROM users")
# Connection is automatically closed after the block`
  },
  {
    id: 'python-metaclass',
    title: 'Metaclass Example',
    description: 'Using metaclasses for class creation control',
    category: 'Advanced',
    language: 'python',
    code: `class Singleton(type):
    """Metaclass for creating singleton classes."""
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class ConfigManager(metaclass=Singleton):
    def __init__(self):
        self.settings = {}
    
    def set(self, key, value):
        self.settings[key] = value
    
    def get(self, key, default=None):
        return self.settings.get(key, default)

# Usage example
config1 = ConfigManager()
config1.set('debug', True)

config2 = ConfigManager()  # Same instance as config1
print(config2.get('debug'))  # Prints: True

# Both variables reference the same instance
print(config1 is config2)  # Prints: True`
  },
  {
    id: 'python-descriptor',
    title: 'Descriptor Protocol',
    description: 'Implementing custom descriptors for attribute access control',
    category: 'Advanced',
    language: 'python',
    code: `class ValidatedField:
    """A descriptor that validates values before setting them."""
    def __init__(self, validator):
        self.validator = validator
        self.name = None
    
    def __set_name__(self, owner, name):
        self.name = name
    
    def __get__(self, instance, owner):
        if instance is None:
            return self
        return instance.__dict__.get(self.name)
    
    def __set__(self, instance, value):
        if not self.validator(value):
            raise ValueError(f"Invalid value for {self.name}: {value}")
        instance.__dict__[self.name] = value

class Person:
    name = ValidatedField(lambda x: isinstance(x, str) and len(x) > 0)
    age = ValidatedField(lambda x: isinstance(x, int) and 0 <= x <= 120)
    email = ValidatedField(
        lambda x: isinstance(x, str) and '@' in x and '.' in x.split('@')[1]
    )
    
    def __init__(self, name, age, email):
        self.name = name
        self.age = age
        self.email = email

# Usage example
try:
    person = Person("John", 30, "john@example.com")  # Works fine
    person.age = -1  # Raises ValueError
except ValueError as e:
    print(f"Validation error: {e}")`
  },
  {
    id: 'python-generator',
    title: 'Generator Pipeline',
    description: 'Creating data processing pipelines with generators',
    category: 'Data Processing',
    language: 'python',
    code: `def read_csv(file_path):
    """Simulate reading a large CSV file."""
    for i in range(1000):
        yield {
            'id': i,
            'name': f'User {i}',
            'score': i % 100
        }

def filter_scores(records, min_score):
    """Filter records by minimum score."""
    for record in records:
        if record['score'] >= min_score:
            yield record

def enrich_data(records):
    """Add computed fields to records."""
    for record in records:
        record['grade'] = 'A' if record['score'] >= 90 else 'B' if record['score'] >= 80 else 'C'
        yield record

def format_output(records):
    """Format records for output."""
    for record in records:
        yield f"ID: {record['id']}, Name: {record['name']}, Score: {record['score']}, Grade: {record['grade']}"

# Usage example
def process_data(file_path, min_score=60):
    # Create processing pipeline
    records = read_csv(file_path)
    filtered = filter_scores(records, min_score)
    enriched = enrich_data(filtered)
    formatted = format_output(enriched)

    # Process records one at a time
    for result in formatted:
        print(result)

# Run the pipeline
process_data('data.csv', min_score=75)`
  }
];