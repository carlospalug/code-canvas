export const kotlinSamples = [
  {
    id: 'kotlin-coroutines',
    title: 'Coroutines',
    description: 'Asynchronous programming with Kotlin Coroutines',
    category: 'Async',
    language: 'kotlin',
    code: `class CoroutineExample {
    suspend fun fetchUserData(userId: String): User = coroutineScope {
        val deferred = async {
            // Simulate API call
            delay(1000)
            User(userId, "John Doe", "john@example.com")
        }

        val result = deferred.await()
        result
    }

    suspend fun processUsers(userIds: List<String>) = coroutineScope {
        val jobs = userIds.map { userId ->
            launch {
                try {
                    val user = fetchUserData(userId)
                    processUser(user)
                } catch (e: Exception) {
                    println("Error processing user \${userId}: \${e.message}")
                }
            }
        }
        jobs.joinAll()
    }

    private suspend fun processUser(user: User) {
        // Simulate processing
        delay(500)
        println("Processed user: \${user.name}")
    }

    data class User(
        val id: String,
        val name: String,
        val email: String
    )

    // Usage example
    suspend fun main() = coroutineScope {
        val userIds = listOf("1", "2", "3", "4", "5")
        
        withContext(Dispatchers.IO) {
            processUsers(userIds)
        }
    }
}`
  },
  {
    id: 'kotlin-dsl',
    title: 'DSL Builder Pattern',
    description: 'Type-safe builders using Kotlin DSL',
    language: 'kotlin',
    category: 'Patterns',
    code: `class HTML {
    private val children = mutableListOf<Tag>()
    
    fun render(): String = children.joinToString("\\n") { it.render() }
    
    fun head(init: Head.() -> Unit) {
        children.add(Head().apply(init))
    }
    
    fun body(init: Body.() -> Unit) {
        children.add(Body().apply(init))
    }
}

abstract class Tag {
    protected val children = mutableListOf<Tag>()
    protected val attributes = mutableMapOf<String, String>()
    
    abstract fun render(): String
    
    protected fun renderAttributes(): String {
        if (attributes.isEmpty()) return ""
        return attributes.entries.joinToString(" ", prefix = " ") { 
            "\${it.key}=\\"\${it.value}\\"" 
        }
    }
}

class Head : Tag() {
    fun title(text: String) {
        children.add(Title(text))
    }
    
    override fun render(): String {
        return "<head>" + children.joinToString("") { it.render() } + "</head>"
    }
}

class Body : Tag() {
    fun div(init: Div.() -> Unit) {
        children.add(Div().apply(init))
    }
    
    override fun render(): String {
        return "<body>" + children.joinToString("") { it.render() } + "</body>"
    }
}

class Div : Tag() {
    fun text(value: String) {
        children.add(Text(value))
    }
    
    fun className(value: String) {
        attributes["class"] = value
    }
    
    override fun render(): String {
        return "<div" + renderAttributes() + ">" + 
            children.joinToString("") { it.render() } + 
        "</div>"
    }
}

class Title(private val text: String) : Tag() {
    override fun render(): String = "<title>\${text}</title>"
}

class Text(private val text: String) : Tag() {
    override fun render(): String = text
}

// Usage example
fun html(init: HTML.() -> Unit): HTML {
    return HTML().apply(init)
}

fun main() {
    val page = html {
        head {
            title("Welcome")
        }
        body {
            div {
                className("container")
                text("Hello, World!")
            }
        }
    }
    
    println(page.render())
}`
  }
];