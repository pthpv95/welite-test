export type BooksResponse = {
  totalItems: number;
  items: BookItem[];
};

export type BookItem = {
  id: string;
  volumeInfo: {
    title: string;
    subtitle: string;
    authors: string[];
    imageLinks: {
      thumbnail?: string;
    };
  };
};
