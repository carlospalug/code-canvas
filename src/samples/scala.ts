export const scalaSamples = [
  {
    id: 'scala-type-classes',
    title: 'Type Classes Pattern',
    description: 'Implementation of type classes in Scala',
    category: 'Patterns',
    language: 'scala',
    code: `// Define a type class
trait Show[A] {
  def show(value: A): String
}

// Define type class instances
object Show {
  def apply[A](implicit sh: Show[A]): Show[A] = sh

  implicit val intShow: Show[Int] = new Show[Int] {
    def show(value: Int): String = value.toString
  }

  implicit val stringShow: Show[String] = new Show[String] {
    def show(value: String): String = value
  }

  implicit def listShow[A](implicit sh: Show[A]): Show[List[A]] = 
    new Show[List[A]] {
      def show(value: List[A]): String = 
        value.map(sh.show).mkString("[", ", ", "]")
    }
}

// Define syntax extensions
object syntax {
  implicit class ShowOps[A](value: A)(implicit sh: Show[A]) {
    def show: String = sh.show(value)
  }
}

// Example usage
import syntax._

case class Person(name: String, age: Int)

object Person {
  implicit val personShow: Show[Person] = new Show[Person] {
    def show(value: Person): String = 
      s"Person(name: \${value.name}, age: \${value.age})"
  }
}

val person = Person("John", 30)
println(person.show)  // Person(name: John, age: 30)

val numbers = List(1, 2, 3)
println(numbers.show)  // [1, 2, 3]`
  },
  {
    id: 'scala-futures',
    title: 'Future Combinators',
    description: 'Working with Futures in Scala',
    category: 'Async',
    language: 'scala',
    code: `import scala.concurrent.{Future, ExecutionContext}
import scala.concurrent.duration._
import scala.util.{Success, Failure}

case class User(id: String, name: String)
case class Order(id: String, userId: String, total: Double)

class UserService {
  def getUser(id: String)(implicit ec: ExecutionContext): Future[User] = {
    // Simulate API call
    Future {
      Thread.sleep(100)
      User(id, "John Doe")
    }
  }
}

class OrderService {
  def getOrders(userId: String)(implicit ec: ExecutionContext): Future[List[Order]] = {
    // Simulate API call
    Future {
      Thread.sleep(200)
      List(
        Order("1", userId, 99.99),
        Order("2", userId, 49.99)
      )
    }
  }
}

object FutureExample extends App {
  implicit val ec: ExecutionContext = ExecutionContext.global
  
  val userService = new UserService
  val orderService = new OrderService
  
  // Combine futures
  def getUserWithOrders(userId: String): Future[(User, List[Order])] = {
    val userF = userService.getUser(userId)
    val ordersF = orderService.getOrders(userId)
    
    // Run in parallel and combine results
    for {
      user <- userF
      orders <- ordersF
    } yield (user, orders)
  }
  
  // Handle errors
  def processUser(userId: String): Future[String] = {
    getUserWithOrders(userId)
      .map { case (user, orders) =>
        val total = orders.map(_.total).sum
        s"\${user.name} has \${orders.length} orders, total: $\${total}"
      }
      .recover {
        case ex: Exception => s"Error processing user: \${ex.getMessage}"
      }
  }
  
  // Sequence futures
  def processUsers(userIds: List[String]): Future[List[String]] = {
    Future.traverse(userIds)(processUser)
  }
  
  // Usage example
  val userIds = List("1", "2", "3")
  
  processUsers(userIds).onComplete {
    case Success(results) => 
      results.foreach(println)
    case Failure(ex) => 
      println(s"Error: \${ex.getMessage}")
  }
  
  // Keep the program running
  Thread.sleep(1000)
}`
  }
];