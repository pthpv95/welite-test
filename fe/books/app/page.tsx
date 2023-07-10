import SearchBox from "@/app/search-box";
import { fetchBooks } from "./api";
import BookCards from "./book-cards";

export default async function Home({
  searchParams,
}: {
  searchParams: { searchTerm: string };
}) {
  const booksResponse = await fetchBooks({
    searchTerm: searchParams.searchTerm,
  });

  return (
    <div className="p-5">
      <SearchBox searchTerm={searchParams.searchTerm} />
      <BookCards
        books={booksResponse.items}
        searchTerm={searchParams.searchTerm}
      />
    </div>
  );
}
