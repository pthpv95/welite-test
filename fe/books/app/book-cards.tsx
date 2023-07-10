"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { fetchBooks } from "./api";
import { BookItem } from "./types";

const BookCard = forwardRef(({ book }: { book: BookItem }, ref: any) => {
  return (
    <Card key={book.id} ref={ref} className="mb-2">
      <CardHeader>
        <CardTitle>{book.volumeInfo.title}</CardTitle>
        <CardDescription>{book.volumeInfo.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src={
            book.volumeInfo.imageLinks?.thumbnail || "https://placehold.co/100"
          }
          alt={book.volumeInfo.title}
          width={100}
          height={100}
          unoptimized
        />
      </CardContent>
      <CardFooter>{book.volumeInfo.authors?.[0]}</CardFooter>
    </Card>
  );
});

BookCard.displayName = "BookCard";

const PAGE_SIZE = 5;
function BookCards({
  books,
  searchTerm,
}: {
  books: BookItem[];
  searchTerm: string;
}) {
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BookItem[]>(
    [...books].slice(0, PAGE_SIZE)
  );

  useEffect(() => {
    if (page === 0) return;

    // handle load more data
    setLoading(true);
    fetchBooks({ page, searchTerm }).then((res) => {
      if (res.items) {
        setItems((prev) => [...prev, ...res.items]);
      } else {
        setHasMore(false);
      }
      setLoading(false);
    });
  }, [page, searchTerm]);

  useEffect(() => {
    // init data when search books change
    setItems([...books].slice(0, PAGE_SIZE));
  }, [books]);

  const observer: any = useRef(null);
  const lastBookElementRef = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // if it hits bottom, increase page
          setPage((page) => page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      {items.map((book: BookItem, index: number) => {
        if (items.length === index + 1) {
          return <BookCard key={index} ref={lastBookElementRef} book={book} />;
        } else {
          return <BookCard key={index} book={book} />;
        }
      })}
      {loading && <p className="pt-3">Loading ... </p>}
    </>
  );
}

export default BookCards;
