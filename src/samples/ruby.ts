export const rubySamples = [
  {
    id: 'ruby-metaprogramming',
    title: 'Metaprogramming',
    description: 'Dynamic method creation and attribute handling',
    category: 'Metaprogramming',
    language: 'ruby',
    code: `module AttributeBuilder
  def has_attributes(*attributes)
    attributes.each do |attribute|
      # Create getter
      define_method(attribute) do
        instance_variable_get("@#{attribute}")
      end
      
      # Create setter
      define_method("#{attribute}=") do |value|
        instance_variable_set("@#{attribute}", value)
      end
      
      # Create predicate method
      define_method("#{attribute}?") do
        !!instance_variable_get("@#{attribute}")
      end
    end
  end
  
  def has_lazy_attribute(name, &block)
    define_method(name) do
      # Memoize the result
      @lazy_values ||= {}
      @lazy_values[name] ||= instance_eval(&block)
    end
  end
end

class Person
  extend AttributeBuilder
  
  has_attributes :name, :age, :email
  
  has_lazy_attribute :full_profile do
    "#{name} (#{age}) - #{email}"
  end
end

# Usage
person = Person.new
person.name = "John Doe"
person.age = 30
person.email = "john@example.com"

puts person.name          # => "John Doe"
puts person.age?         # => true
puts person.full_profile # => "John Doe (30) - john@example.com"`
  }
];