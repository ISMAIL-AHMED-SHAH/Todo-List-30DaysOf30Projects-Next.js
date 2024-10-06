"use client"; // Enables client-side rendering for this component

import { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTaskText, setEditedTaskText] = useState<string>("");
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks) as Task[]);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = (): void => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTaskCompletion = (id: number): void => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditingTask = (id: number, text: string): void => {
    setEditingTaskId(id);
    setEditedTaskText(text);
  };

  const updateTask = (): void => {
    if (editedTaskText.trim() !== "") {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, text: editedTaskText } : task
        )
      );
      setEditingTaskId(null);
      setEditedTaskText("");
    }
  };

  const deleteTask = (id: number): void => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-2xl p-8 rounded-lg shadow-2xl bg-gray-800 border border-gray-700 transition-all hover:border-green-500 hover:shadow-green-500/50">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal-400">
          Todo List
        </h1>

        <div className="flex items-center mb-6">
          <Input
            type="text"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTask(e.target.value)}
            className="flex-1 mr-3 px-4 py-2 rounded-lg bg-gray-700 border-none focus:ring-2 focus:ring-teal-500 text-white"
          />
          <Button
            onClick={addTask}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between bg-gray-700 p-4 rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
            >
              <div className="flex items-center">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                  className="mr-3"
                />
                {editingTaskId === task.id ? (
                  <Input
                    type="text"
                    value={editedTaskText}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setEditedTaskText(e.target.value)
                    }
                    onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") updateTask();
                    }}
                    className="flex-1 bg-gray-600 text-white rounded-md px-3 py-2"
                  />
                ) : (
                  <span
                    className={`text-lg ${
                      task.completed
                        ? "line-through text-gray-400"
                        : "text-gray-100"
                    }`}
                  >
                    {task.text}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {editingTaskId === task.id ? (
                  <Button
                    onClick={updateTask}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-1 px-3 rounded-md transition"
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    onClick={() => startEditingTask(task.id, task.text)}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-md transition"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-8 text-sm text-teal-400">
        Created By Ismail Ahmed Shah
      </footer>
    </div>
  );
}
