export const rustSamples = [
  {
    id: 'rust-error-handling',
    title: 'Custom Error Type',
    description: 'Implementation of a custom error type with error handling',
    category: 'Error Handling',
    language: 'rust',
    code: `use std::error::Error;
use std::fmt;

#[derive(Debug)]
pub enum AppError {
    IoError(std::io::Error),
    ParseError(String),
    ValidationError { field: String, message: String },
}

impl Error for AppError {}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::IoError(err) => write!(f, "IO error: {}", err),
            AppError::ParseError(msg) => write!(f, "Parse error: {}", msg),
            AppError::ValidationError { field, message } => {
                write!(f, "Validation error for {}: {}", field, message)
            }
        }
    }
}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> AppError {
        AppError::IoError(err)
    }
}

// Example usage
fn validate_user(name: &str, age: i32) -> Result<(), AppError> {
    if name.is_empty() {
        return Err(AppError::ValidationError {
            field: "name".to_string(),
            message: "Name cannot be empty".to_string(),
        });
    }

    if age < 0 || age > 150 {
        return Err(AppError::ValidationError {
            field: "age".to_string(),
            message: "Age must be between 0 and 150".to_string(),
        });
    }

    Ok(())
}`
  },
  {
    id: 'rust-async',
    title: 'Async/Await Pattern',
    description: 'Asynchronous programming with Rust',
    category: 'Async',
    language: 'rust',
    code: `use tokio;
use std::time::Duration;

async fn fetch_data(id: u32) -> Result<String, Box<dyn std::error::Error>> {
    // Simulate API call
    tokio::time::sleep(Duration::from_secs(1)).await;
    Ok(format!("Data for id: {}", id))
}

async fn process_data(data: String) -> Result<String, Box<dyn std::error::Error>> {
    // Simulate processing
    tokio::time::sleep(Duration::from_millis(500)).await;
    Ok(format!("Processed: {}", data))
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut handles = vec![];
    
    // Spawn multiple concurrent tasks
    for i in 0..5 {
        let handle = tokio::spawn(async move {
            let data = fetch_data(i).await?;
            let result = process_data(data).await?;
            Ok::<_, Box<dyn std::error::Error>>(result)
        });
        handles.push(handle);
    }
    
    // Wait for all tasks to complete
    for handle in handles {
        match handle.await? {
            Ok(result) => println!("{}", result),
            Err(e) => eprintln!("Error: {}", e),
        }
    }
    
    Ok(())
}`
  }
];