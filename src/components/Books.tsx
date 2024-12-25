'use client'

import { useState, useEffect } from 'react';

interface Book {
  id: number;
  title: string;
  author: string;
  available: boolean;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', available: true });
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  const addBook = async () => {
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
    const data = await res.json();
    setBooks([...books, data]);
    setNewBook({ title: '', author: '', available: true });
  };

  const updateBook = async (id: number) => {
    const res = await fetch('/api/books', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editBook, id }),
    });
    const updatedBook = await res.json();
    setBooks(books.map((book) => (book.id === id ? updatedBook : book)));
    setEditBook(null);
  };

  const deleteBook = async (id: number) => {
    await fetch('/api/books', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setBooks(books.filter((book) => book.id !== id));
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-800 text-white p-6 space-y-6">
        <h1 className="text-3xl font-semibold">Library</h1>
        <nav>
          <ul>
            <li>
              <a href="#add-book" className="block py-2 hover:bg-indigo-700 rounded-md">Add Book</a>
            </li>
            <li>
              <a href="#books-list" className="block py-2 hover:bg-indigo-700 rounded-md">Books List</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 bg-gray-50">
        <h2 className="text-4xl font-semibold text-indigo-700 mb-8">Library Management</h2>

        {/* Add Book Form */}
        <div id="add-book" className="bg-white p-6 rounded-lg shadow-lg mb-12">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">Add New Book</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Book Title"
              className="w-full p-4 border border-gray-300 rounded-lg"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Author Name"
              className="w-full p-4 border border-gray-300 rounded-lg"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <div className="flex items-center space-x-4">
              <label className="text-gray-700">Available:</label>
              <input
                type="checkbox"
                checked={newBook.available}
                onChange={(e) => setNewBook({ ...newBook, available: e.target.checked })}
                className="w-6 h-6"
              />
            </div>
            <button
              className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-4"
              onClick={addBook}
            >
              Add Book
            </button>
          </div>
        </div>

        {/* Books List */}
        <div id="books-list" className="space-y-6">
          <input
            type="text"
            placeholder="Search by Title or Author"
            className="w-full p-4 border border-gray-300 rounded-lg mb-6"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-semibold text-indigo-600">{book.title}</h3>
                <p className="text-gray-600">{book.author}</p>
                <div className="mt-4">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-xs ${
                      book.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {book.available ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md"
                    onClick={() => setEditBook(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded-md"
                    onClick={() => deleteBook(book.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Book Form */}
        {editBook && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-12">
            <h3 className="text-2xl font-semibold text-purple-600 mb-4">Edit Book</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Book Title"
                className="w-full p-4 border border-gray-300 rounded-lg"
                value={editBook.title}
                onChange={(e) => setEditBook({ ...editBook, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Author Name"
                className="w-full p-4 border border-gray-300 rounded-lg"
                value={editBook.author}
                onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
              />
              <div className="flex items-center space-x-4">
                <label className="text-gray-700">Available:</label>
                <input
                  type="checkbox"
                  checked={editBook.available}
                  onChange={(e) => setEditBook({ ...editBook, available: e.target.checked })}
                  className="w-6 h-6"
                />
              </div>
              <button
                className="w-full bg-purple-600 text-white py-3 rounded-lg mt-4"
                onClick={() => updateBook(editBook.id)}
              >
                Update Book
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
