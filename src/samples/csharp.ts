export const csharpSamples = [
  {
    id: 'csharp-linq',
    title: 'LINQ Examples',
    description: 'Common LINQ operations and patterns',
    category: 'Data Processing',
    language: 'csharp',
    code: `public class LinqExamples
{
    public class Person
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public string Department { get; set; }
    }

    public void DemonstrateLinq()
    {
        var people = new List<Person>
        {
            new Person { Name = "John", Age = 30, Department = "IT" },
            new Person { Name = "Alice", Age = 25, Department = "HR" },
            new Person { Name = "Bob", Age = 35, Department = "IT" },
            new Person { Name = "Carol", Age = 28, Department = "Finance" }
        };

        // Filtering
        var itPeople = people.Where(p => p.Department == "IT");

        // Ordering
        var orderedByAge = people.OrderBy(p => p.Age)
                                .ThenBy(p => p.Name);

        // Grouping
        var byDepartment = people.GroupBy(p => p.Department)
                                .Select(g => new {
                                    Department = g.Key,
                                    Count = g.Count(),
                                    AverageAge = g.Average(p => p.Age)
                                });

        // Aggregation
        var stats = new
        {
            TotalPeople = people.Count(),
            AverageAge = people.Average(p => p.Age),
            Departments = people.Select(p => p.Department).Distinct()
        };

        // Multiple operations
        var result = people.Where(p => p.Age > 25)
                         .OrderBy(p => p.Name)
                         .Select(p => new {
                             FullInfo = $"{p.Name} ({p.Age}) - {p.Department}",
                             IsExperienced = p.Age > 30
                         });
    }
}`
  },
  {
    id: 'csharp-async',
    title: 'Async/Await Pattern',
    description: 'Asynchronous programming in C#',
    category: 'Async',
    language: 'csharp',
    code: `public class AsyncExample
{
    private readonly HttpClient _client = new HttpClient();

    public async Task<IEnumerable<string>> ProcessUrlsAsync(
        IEnumerable<string> urls,
        IProgress<int> progress = null)
    {
        var results = new List<string>();
        var tasks = new List<Task<string>>();
        var processed = 0;

        foreach (var url in urls)
        {
            tasks.Add(ProcessUrlAsync(url));
        }

        while (tasks.Any())
        {
            var completedTask = await Task.WhenAny(tasks);
            tasks.Remove(completedTask);

            try
            {
                var result = await completedTask;
                results.Add(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing URL: {ex.Message}");
            }

            processed++;
            progress?.Report((processed * 100) / urls.Count());
        }

        return results;
    }

    private async Task<string> ProcessUrlAsync(string url)
    {
        try
        {
            var response = await _client.GetStringAsync(url);
            await Task.Delay(100); // Simulate processing
            return $"Processed {url}: {response.Length} chars";
        }
        catch (Exception ex)
        {
            throw new Exception($"Error processing {url}: {ex.Message}");
        }
    }

    // Usage example
    public async Task RunExample()
    {
        var urls = new[]
        {
            "https://api.example.com/1",
            "https://api.example.com/2",
            "https://api.example.com/3"
        };

        var progress = new Progress<int>(percent =>
            Console.WriteLine($"Progress: {percent}%"));

        var results = await ProcessUrlsAsync(urls, progress);
        foreach (var result in results)
        {
            Console.WriteLine(result);
        }
    }
}`
  },
  {
    id: 'csharp-generics',
    title: 'Advanced Generics',
    description: 'Generic constraints and covariance',
    category: 'Advanced',
    language: 'csharp',
    code: `public interface IRepository<T> where T : class, IEntity
{
    Task<T> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}

public interface IEntity
{
    int Id { get; set; }
    DateTime CreatedAt { get; set; }
    DateTime? UpdatedAt { get; set; }
}

public class Repository<T> : IRepository<T> where T : class, IEntity
{
    private readonly DbContext _context;
    private readonly DbSet<T> _entities;

    public Repository(DbContext context)
    {
        _context = context;
        _entities = context.Set<T>();
    }

    public async Task<T> GetByIdAsync(int id)
    {
        return await _entities.FindAsync(id);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _entities.ToListAsync();
    }

    public async Task<T> AddAsync(T entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        await _entities.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        entity.UpdatedAt = DateTime.UtcNow;
        _entities.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _entities.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }
}`
  },
  {
    id: 'csharp-events',
    title: 'Event Pattern',
    description: 'Custom event implementation with generic EventArgs',
    category: 'Patterns',
    language: 'csharp',
    code: `public class DataEventArgs<T> : EventArgs
{
    public T Data { get; }
    public DateTime Timestamp { get; }

    public DataEventArgs(T data)
    {
        Data = data;
        Timestamp = DateTime.UtcNow;
    }
}

public class DataProcessor<T>
{
    public event EventHandler<DataEventArgs<T>> DataProcessed;
    public event EventHandler<Exception> ErrorOccurred;

    protected virtual void OnDataProcessed(T data)
    {
        DataProcessed?.Invoke(this, new DataEventArgs<T>(data));
    }

    protected virtual void OnErrorOccurred(Exception ex)
    {
        ErrorOccurred?.Invoke(this, ex);
    }

    public async Task ProcessAsync(T data)
    {
        try
        {
            await Task.Delay(100); // Simulate processing
            // Process data here
            OnDataProcessed(data);
        }
        catch (Exception ex)
        {
            OnErrorOccurred(ex);
            throw;
        }
    }
}

// Example usage
public class Program
{
    public static async Task Main()
    {
        var processor = new DataProcessor<string>();

        processor.DataProcessed += (sender, e) =>
        {
            Console.WriteLine($"Data processed at {e.Timestamp}: {e.Data}");
        };

        processor.ErrorOccurred += (sender, ex) =>
        {
            Console.WriteLine($"Error occurred: {ex.Message}");
        };

        await processor.ProcessAsync("Test data");
    }
}`
  }
];