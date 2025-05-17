export const haskellSamples = [
  {
    id: 'haskell-monad',
    title: 'Custom Monad Implementation',
    description: 'Creating a custom monad in Haskell',
    category: 'Functional',
    language: 'haskell',
    code: `-- Define a custom Maybe-like monad
data Result a = Success a | Error String
  deriving (Show)

instance Functor Result where
  fmap f (Success x) = Success (f x)
  fmap _ (Error msg) = Error msg

instance Applicative Result where
  pure = Success
  Success f <*> Success x = Success (f x)
  Error msg <*> _ = Error msg
  _ <*> Error msg = Error msg

instance Monad Result where
  Success x >>= f = f x
  Error msg >>= _ = Error msg

-- Helper functions
success :: a -> Result a
success = Success

error :: String -> Result a
error = Error

-- Example usage
divide :: Double -> Double -> Result Double
divide _ 0 = Error "Division by zero"
divide x y = Success (x / y)

safeSqrt :: Double -> Result Double
safeSqrt x
  | x < 0     = Error "Cannot take square root of negative number"
  | otherwise = Success (sqrt x)

-- Compose operations using do notation
computeResult :: Double -> Double -> Result Double
computeResult x y = do
  divided <- divide x y
  safeSqrt divided

-- Example with error handling
processNumbers :: [(Double, Double)] -> [String]
processNumbers = map processOne
  where
    processOne (x, y) = case computeResult x y of
      Success result -> "Result: " ++ show result
      Error msg     -> "Error: " ++ msg

-- Test the implementation
main :: IO ()
main = do
  let inputs = [(16.0, 4.0), (16.0, 0.0), (-16.0, 4.0)]
  mapM_ putStrLn $ processNumbers inputs`
  }
];