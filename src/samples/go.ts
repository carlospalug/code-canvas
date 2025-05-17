export const goSamples = [
  {
    id: 'go-worker-pool',
    title: 'Worker Pool Pattern',
    description: 'Implementation of a worker pool using goroutines and channels',
    category: 'Concurrency',
    language: 'go',
    code: `package main

import (
    "fmt"
    "sync"
)

// Job represents a unit of work
type Job struct {
    ID   int
    Data interface{}
}

// Result represents the output of a job
type Result struct {
    JobID int
    Data  interface{}
}

// Worker pool implementation
func WorkerPool(numWorkers int, jobs <-chan Job, results chan<- Result) {
    var wg sync.WaitGroup
    
    // Start workers
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go worker(i, jobs, results, &wg)
    }
    
    // Wait for all workers to complete
    wg.Wait()
    close(results)
}

// Individual worker
func worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
    defer wg.Done()
    
    for job := range jobs {
        // Process job
        result := processJob(job)
        results <- result
    }
}

func processJob(job Job) Result {
    // Simulate work
    // In real application, do actual processing here
    return Result{
        JobID: job.ID,
        Data:  fmt.Sprintf("Processed job %d", job.ID),
    }
}

func main() {
    numJobs := 10
    numWorkers := 3
    
    jobs := make(chan Job, numJobs)
    results := make(chan Result, numJobs)
    
    // Start worker pool
    go WorkerPool(numWorkers, jobs, results)
    
    // Send jobs
    for i := 0; i < numJobs; i++ {
        jobs <- Job{ID: i, Data: fmt.Sprintf("Job %d", i)}
    }
    close(jobs)
    
    // Collect results
    for result := range results {
        fmt.Printf("Result: %v\\n", result)
    }
}`
  },
  {
    id: 'go-middleware',
    title: 'HTTP Middleware Chain',
    description: 'Creating a middleware chain for HTTP handlers',
    category: 'Web',
    language: 'go',
    code: `package main

import (
    "fmt"
    "log"
    "net/http"
    "time"
)

type Middleware func(http.HandlerFunc) http.HandlerFunc

// Chain applies middlewares in order
func Chain(f http.HandlerFunc, middlewares ...Middleware) http.HandlerFunc {
    for _, m := range middlewares {
        f = m(f)
    }
    return f
}

// Logger middleware
func Logger() Middleware {
    return func(f http.HandlerFunc) http.HandlerFunc {
        return func(w http.ResponseWriter, r *http.Request) {
            start := time.Now()
            defer func() {
                log.Printf(
                    "%s %s %s",
                    r.Method,
                    r.URL.Path,
                    time.Since(start),
                )
            }()
            f(w, r)
        }
    }
}

// Auth middleware
func Auth() Middleware {
    return func(f http.HandlerFunc) http.HandlerFunc {
        return func(w http.ResponseWriter, r *http.Request) {
            token := r.Header.Get("Authorization")
            if token == "" {
                http.Error(w, "Unauthorized", http.StatusUnauthorized)
                return
            }
            f(w, r)
        }
    }
}

// CORS middleware
func CORS() Middleware {
    return func(f http.HandlerFunc) http.HandlerFunc {
        return func(w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Access-Control-Allow-Origin", "*")
            w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
            
            if r.Method == "OPTIONS" {
                w.WriteHeader(http.StatusOK)
                return
            }
            f(w, r)
        }
    }
}

func main() {
    // Handler
    handler := func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintln(w, "Hello, World!")
    }
    
    // Apply middleware chain
    http.HandleFunc("/", Chain(
        handler,
        CORS(),
        Logger(),
        Auth(),
    ))
    
    log.Fatal(http.ListenAndServe(":8080", nil))
}`
  }
];