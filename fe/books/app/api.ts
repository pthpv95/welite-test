import { BooksResponse } from "./types";

export async function fetchBooks(query: {
  searchTerm?: string;
  page?: number;
}): Promise<BooksResponse> {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${
    query.searchTerm || "quilting"
  }&startIndex=${query.page || 0}`;
  return fetch(url).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw res;
  });
}
