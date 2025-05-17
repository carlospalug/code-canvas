export const elixirSamples = [
  {
    id: 'elixir-genserver',
    title: 'GenServer Implementation',
    description: 'Building a stateful server process in Elixir',
    category: 'Concurrent',
    language: 'elixir',
    code: `defmodule TaskManager do
  use GenServer

  # Client API
  def start_link(opts \\ []) do
    GenServer.start_link(__MODULE__, :ok, opts)
  end

  def add_task(server, task) do
    GenServer.cast(server, {:add_task, task})
  end

  def complete_task(server, task_id) do
    GenServer.call(server, {:complete_task, task_id})
  end

  def get_tasks(server) do
    GenServer.call(server, :get_tasks)
  end

  # Server Callbacks
  @impl true
  def init(:ok) do
    {:ok, %{tasks: %{}, next_id: 1}}
  end

  @impl true
  def handle_cast({:add_task, task}, %{tasks: tasks, next_id: id} = state) do
    new_task = %{
      id: id,
      description: task,
      status: :pending,
      created_at: DateTime.utc_now()
    }
    
    new_state = %{
      state |
      tasks: Map.put(tasks, id, new_task),
      next_id: id + 1
    }
    
    {:noreply, new_state}
  end

  @impl true
  def handle_call({:complete_task, task_id}, _from, %{tasks: tasks} = state) do
    case Map.get(tasks, task_id) do
      nil ->
        {:reply, {:error, :not_found}, state}
      task ->
        updated_task = %{task | status: :completed}
        new_tasks = Map.put(tasks, task_id, updated_task)
        {:reply, {:ok, updated_task}, %{state | tasks: new_tasks}}
    end
  end

  @impl true
  def handle_call(:get_tasks, _from, state) do
    {:reply, Map.values(state.tasks), state}
  end
end

# Example usage
defmodule Example do
  def run do
    {:ok, manager} = TaskManager.start_link()
    
    # Add some tasks
    TaskManager.add_task(manager, "Write documentation")
    TaskManager.add_task(manager, "Fix bugs")
    TaskManager.add_task(manager, "Add tests")
    
    # Get all tasks
    tasks = TaskManager.get_tasks(manager)
    IO.puts "Current tasks:"
    Enum.each(tasks, fn task ->
      IO.puts "[\#{task.id}] \#{task.description} (\#{task.status})"
    end)
    
    # Complete a task
    case TaskManager.complete_task(manager, 1) do
      {:ok, task} ->
        IO.puts "Completed task: \#{task.description}"
      {:error, :not_found} ->
        IO.puts "Task not found"
    end
  end
end`
  }
];