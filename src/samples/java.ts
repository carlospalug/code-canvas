export const javaSamples = [
  {
    id: 'java-builder',
    title: 'Builder Pattern',
    description: 'Implementation of the Builder design pattern',
    category: 'Patterns',
    language: 'java',
    code: `public class User {
    private final String firstName;
    private final String lastName;
    private final String email;
    private final int age;
    private final String phone;

    private User(UserBuilder builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.email = builder.email;
        this.age = builder.age;
        this.phone = builder.phone;
    }

    public static class UserBuilder {
        private final String firstName;
        private final String lastName;
        private String email;
        private int age;
        private String phone;

        public UserBuilder(String firstName, String lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder age(int age) {
            this.age = age;
            return this;
        }

        public UserBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}

// Usage example
User user = new User.UserBuilder("John", "Doe")
    .email("john@example.com")
    .age(30)
    .phone("123-456-7890")
    .build();`
  },
  {
    id: 'java-reactive',
    title: 'Reactive Programming',
    description: 'Using Project Reactor for reactive programming',
    category: 'Reactive',
    language: 'java',
    code: `public class ReactiveExample {
    private final WebClient webClient;
    
    public ReactiveExample() {
        this.webClient = WebClient.create();
    }
    
    public Flux<UserEvent> streamUserEvents(String userId) {
        return Flux.interval(Duration.ofSeconds(1))
            .flatMap(tick -> fetchUserActivity(userId))
            .map(this::processEvent)
            .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))
            .doOnError(e -> log.error("Error streaming events: {}", e.getMessage()))
            .onErrorResume(e -> Flux.empty());
    }
    
    private Mono<UserActivity> fetchUserActivity(String userId) {
        return webClient.get()
            .uri("/users/{id}/activity", userId)
            .retrieve()
            .bodyToMono(UserActivity.class);
    }
    
    private UserEvent processEvent(UserActivity activity) {
        return new UserEvent(
            activity.getUserId(),
            activity.getType(),
            LocalDateTime.now()
        );
    }
    
    public Mono<UserStats> aggregateStats(String userId) {
        return streamUserEvents(userId)
            .windowTimeout(100, Duration.ofSeconds(10))
            .flatMap(window -> window.reduce(
                new UserStats(),
                this::updateStats
            ));
    }
    
    private UserStats updateStats(UserStats stats, UserEvent event) {
        stats.incrementEventCount(event.getType());
        return stats;
    }
    
    // Example usage
    public static void main(String[] args) {
        ReactiveExample example = new ReactiveExample();
        
        example.streamUserEvents("user123")
            .subscribe(
                event -> log.info("Event: {}", event),
                error -> log.error("Error: {}", error),
                () -> log.info("Stream completed")
            );
            
        example.aggregateStats("user123")
            .subscribe(
                stats -> log.info("Stats: {}", stats),
                error -> log.error("Error: {}", error)
            );
    }
}`
  },
  {
    id: 'java-completable-future',
    title: 'CompletableFuture Patterns',
    description: 'Advanced asynchronous programming with CompletableFuture',
    category: 'Async',
    language: 'java',
    code: `public class AsyncProcessor {
    private final ExecutorService executor;
    private final Cache<String, CompletableFuture<Data>> cache;
    
    public AsyncProcessor() {
        this.executor = Executors.newFixedThreadPool(10);
        this.cache = CacheBuilder.newBuilder()
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .build();
    }
    
    public CompletableFuture<Data> processAsync(String key) {
        return CompletableFuture
            .supplyAsync(() -> fetchData(key), executor)
            .thenApplyAsync(this::enrichData)
            .thenCombine(
                fetchMetadata(key),
                this::mergeData
            )
            .exceptionally(e -> {
                log.error("Error processing data: {}", e.getMessage());
                return Data.empty();
            });
    }
    
    public CompletableFuture<List<Data>> processBatch(List<String> keys) {
        List<CompletableFuture<Data>> futures = keys.stream()
            .map(this::processAsync)
            .collect(Collectors.toList());
            
        return CompletableFuture.allOf(
            futures.toArray(new CompletableFuture[0])
        ).thenApply(v ->
            futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList())
        );
    }
    
    public CompletableFuture<Data> getOrProcess(String key) {
        return cache.get(key, k ->
            processAsync(k)
                .whenComplete((data, error) -> {
                    if (error != null) {
                        cache.invalidate(key);
                    }
                })
        );
    }
    
    private Data fetchData(String key) {
        // Simulate API call
        sleep(1000);
        return new Data(key, "value");
    }
    
    private CompletableFuture<Metadata> fetchMetadata(String key) {
        return CompletableFuture.supplyAsync(() -> {
            // Simulate API call
            sleep(500);
            return new Metadata(key, LocalDateTime.now());
        });
    }
    
    private Data enrichData(Data data) {
        // Simulate enrichment
        sleep(300);
        return data.withExtra("enriched");
    }
    
    private Data mergeData(Data data, Metadata metadata) {
        return data.withMetadata(metadata);
    }
    
    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
    
    // Example usage
    public static void main(String[] args) {
        AsyncProcessor processor = new AsyncProcessor();
        
        // Single item processing
        processor.processAsync("key1")
            .thenAccept(data -> log.info("Processed: {}", data))
            .join();
            
        // Batch processing
        List<String> keys = Arrays.asList("key1", "key2", "key3");
        processor.processBatch(keys)
            .thenAccept(results -> log.info("Batch results: {}", results))
            .join();
            
        // Cached processing
        processor.getOrProcess("key1")
            .thenAccept(data -> log.info("Cached: {}", data))
            .join();
    }
}`
  }
];