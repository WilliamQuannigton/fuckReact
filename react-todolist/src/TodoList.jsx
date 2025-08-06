
import React, { useState, useEffect } from 'react';
import './TodoList.css';

const TodoList = () => {
    // 从 localStorage 初始化 todos，如果没有数据则使用空数组
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [inputValue, setInputValue] = useState('');

    // 当 todos 状态变化时，保存到 localStorage
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    // 处理输入框内容变化
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // 处理添加待办事项
    const handleAddTodo = () => {
        if (inputValue.trim()) {
            setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
            setInputValue('');
        }
    };

    // 处理删除待办事项
    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    // 处理完成待办事项
    const completeTodo = (id) => {
        setTodos(todos.map(todo => todo.id === id ? {...todo, completed: true} : todo));
    }

    // 清除所有待办事项
    const clearAllTodos = () => {
        if (window.confirm('确定要清除所有待办事项吗？此操作不可撤销。')) {
            setTodos([]);
        }
    }

    // 处理回车键添加
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTodo();
        }
    };

    return (
        <div className="todo-container">
            <h1 className="todo-title">✨ 待办事项 ✨</h1>
            
            <div className="input-section">
                <input
                    type="text"
                    className="todo-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="请输入待办事项..."
                />
                <button className="add-button" onClick={handleAddTodo}>
                    ➕ 添加
                </button>
            </div>
            
            {todos.length > 0 && (
                <div className="clear-section">
                    <button className="clear-button" onClick={clearAllTodos}>
                        🗑️ 清除所有
                    </button>
                </div>
            )}

            <ul className="todo-list">
                {todos.length === 0 ? (
                    <div className="empty-state">
                        📝 还没有待办事项，开始添加吧！
                    </div>
                ) : (
                    todos.map(todo => (
                        <li key={todo.id} className="todo-item">
                            {todo.completed ? (
                                <span className="todo-text">{todo.text}</span>
                            ) : (
                                <>
                                    {todo.isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={todo.editValue !== undefined ? todo.editValue : todo.text}
                                                onChange={e => {
                                                    setTodos(todos.map(t =>
                                                        t.id === todo.id
                                                            ? { ...t, editValue: e.target.value }
                                                            : t
                                                    ));
                                                }}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        setTodos(todos.map(t =>
                                                            t.id === todo.id
                                                                ? { ...t, text: t.editValue || t.text, isEditing: false, editValue: undefined }
                                                                : t
                                                        ));
                                                    }
                                                    if (e.key === 'Escape') {
                                                        setTodos(todos.map(t =>
                                                            t.id === todo.id
                                                                ? { ...t, isEditing: false, editValue: undefined }
                                                                : t
                                                        ));
                                                    }
                                                }}
                                                autoFocus
                                            />
                                            <button
                                                className="save-button"
                                                onClick={() => {
                                                    setTodos(todos.map(t =>
                                                        t.id === todo.id
                                                            ? { ...t, text: t.editValue || t.text, isEditing: false, editValue: undefined }
                                                            : t
                                                    ));
                                                }}
                                            >
                                                💾 保存
                                            </button>
                                            <button
                                                className="cancel-button"
                                                onClick={() => {
                                                    setTodos(todos.map(t =>
                                                        t.id === todo.id
                                                            ? { ...t, isEditing: false, editValue: undefined }
                                                            : t
                                                    ));
                                                }}
                                            >
                                                取消
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="todo-text">{todo.text}</span>
                                            <button
                                                className="edit-button"
                                                onClick={() => {
                                                    setTodos(todos.map(t =>
                                                        t.id === todo.id
                                                            ? { ...t, isEditing: true, editValue: t.text }
                                                            : t
                                                    ));
                                                }}
                                                title="编辑此待办事项"
                                            >
                                                ✏️ 编辑
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                            {!todo.isEditing && (
                                <>
                                    <button 
                                        className="delete-button" 
                                        onClick={() => deleteTodo(todo.id)}
                                        title="删除此待办事项"
                                    >
                                        🗑️ 删除
                                    </button>
                                    <button 
                                        className={`complete-button${todo.completed ? ' completed' : ''}`} 
                                        onClick={() => completeTodo(todo.id)}
                                        title="完成此待办事项"
                                        disabled={todo.completed}
                                        style={todo.completed ? { backgroundColor: '#4caf50', color: 'white', textDecoration: 'line-through', opacity: 0.7 } : {}}
                                    >
                                        {todo.completed ? '✅ 已完成' : '✅ 完成'}
                                    </button>
                                </>
                            )}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TodoList;