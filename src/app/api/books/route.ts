import { NextResponse } from "next/server";

const books = [
  { id: 1, title: "Hamlet", author: "William Shakespeare", available: true },
  { id: 2, title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", available: true },
  { id: 3, title: "Main Anmol", author: "Aapa Anmol", available: false },
  { id: 4, title: "Tale of Izrail", author: "Allama Iqbal", available: true },
];

export async function GET() {
  try {
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ message: "Error fetching books" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newBook = await request.json();
    const id = books.length > 0 ? books[books.length - 1].id + 1 : 1;
    const book = { id, ...newBook };
    books.push(book);
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json({ message: "Error creating book" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedBookData = await request.json();
    const { id } = updatedBookData;
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    const updatedBook = { ...books[index], ...updatedBookData };
    books[index] = updatedBook;

    return NextResponse.json(updatedBook, { status: 200 });
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json({ message: "Error updating book" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const index = books.findIndex((book) => book.id === id);

    if (index === -1) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    books.splice(index, 1); // Delete the book from the array

    return NextResponse.json({ message: "Book deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json({ message: "Error deleting book" }, { status: 500 });
  }
}
