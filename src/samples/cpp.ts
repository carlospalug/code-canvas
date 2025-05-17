export const cppSamples = [
  {
    id: 'cpp-smart-pointer',
    title: 'Smart Pointer Implementation',
    description: 'Custom implementation of a simple smart pointer',
    category: 'Memory Management',
    language: 'cpp',
    code: `template<typename T>
class SmartPtr {
private:
    T* ptr;
    size_t* refCount;

public:
    // Constructor
    explicit SmartPtr(T* p = nullptr) : ptr(p) {
        refCount = new size_t(1);
    }

    // Copy constructor
    SmartPtr(const SmartPtr<T>& other) : ptr(other.ptr), refCount(other.refCount) {
        (*refCount)++;
    }

    // Assignment operator
    SmartPtr<T>& operator=(const SmartPtr<T>& other) {
        if (this != &other) {
            release();
            ptr = other.ptr;
            refCount = other.refCount;
            (*refCount)++;
        }
        return *this;
    }

    // Destructor
    ~SmartPtr() {
        release();
    }

    // Dereference operator
    T& operator*() { return *ptr; }
    T* operator->() { return ptr; }

    // Get reference count
    size_t getCount() const { return *refCount; }

private:
    void release() {
        (*refCount)--;
        if (*refCount == 0) {
            delete ptr;
            delete refCount;
        }
    }
};

// Usage example
int main() {
    SmartPtr<int> ptr1(new int(42));
    SmartPtr<int> ptr2 = ptr1;  // Reference count = 2
    
    {
        SmartPtr<int> ptr3 = ptr1;  // Reference count = 3
    }  // ptr3 goes out of scope, count = 2
    
    return 0;
}`
  }
];