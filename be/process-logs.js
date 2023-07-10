const _ = require("lodash");
const fs = require("fs");

// 100page, 20pages -> no space, wrong grammar
// 1pages, 20page
// 100 pages, 100 page

const logs = [
  "Comics 100pages Star Wars 40 pages 4.5",
  "Science fiction 213 pages Del Rey The Hitchhiker's Guide to the Galaxy 20pages 4",
  "science fiction 230 pages Ace The Moon Is a Harsh Mistress 200 pages 3.5",
  "Science fiction 120 pages Del Rey The Hitchhiker's Guide to the Galaxy 20pages 3",
  "Comics 150pages Star Wars 35 pages 3.5",
  "science fiction 230 pages Ace The Moon Is a Harsh Mistress 1 pages 5",
];

const PAGES = "pages";

function getWordBoundsAtPosition(str, position) {
  const isSpace = (c) => /\s/.exec(c);
  let start = position - 1;
  let end = position;

  while (start >= 0 && !isSpace(str[start])) {
    start -= 1;
  }
  start = Math.max(0, start + 1);

  while (end < str.length && !isSpace(str[end])) {
    end += 1;
  }
  end = Math.max(start, end);

  return [start, end];
}

function process() {
  function getTotalPages(item) {
    const pageIndex = item.indexOf(PAGES);
    const [start, end] = getWordBoundsAtPosition(item, pageIndex - 1);
    const wordAtPosition = item.substring(start, end);

    if (wordAtPosition.includes(PAGES)) {
      return wordAtPosition.substring(0, wordAtPosition.length - PAGES.length);
    }
    return wordAtPosition;
  }

  function getNumberOfPagesRead(item) {
    const pageIndex = item.lastIndexOf(PAGES);
    const [start, end] = getWordBoundsAtPosition(item, pageIndex - 1);
    const wordAtPosition = item.substring(start, end);

    if (wordAtPosition.includes(PAGES)) {
      return wordAtPosition.substring(0, wordAtPosition.length - PAGES.length);
    }
    return wordAtPosition;
  }

  let group = {};
  let highestReadingRate;
  let formattedData = [];

  logs.forEach((item) => {
    const splitWords = item.split(" ");
    const totalPages = +getTotalPages(item);
    const noOfPagesRead = getNumberOfPagesRead(item);
    const categoryIndex = item.indexOf(totalPages);
    const category = item.substring(0, categoryIndex - 1);
    const title = item.substring(
      item.indexOf(PAGES) + 6,
      item.lastIndexOf(noOfPagesRead) - 1
    );

    const bookItem = {
      category,
      totalPages,
      numberOfPages: noOfPagesRead,
      rate: +splitWords[splitWords.length - 1],
      title,
      readingRate: noOfPagesRead / totalPages,
    };

    if (!highestReadingRate) {
      highestReadingRate = bookItem;
    } else if (bookItem.readingRate > highestReadingRate.readingRate) {
      highestReadingRate = bookItem;
    }

    if (!group[title]) {
      group[title] = [bookItem];
    } else {
      group[title].push(bookItem);
    }

    formattedData.push(bookItem);
  });

  fs.writeFileSync("logs.json", JSON.stringify(formattedData, null, 4));

  const bookRates = _.compact(
    group[highestReadingRate.title].map((x) => x.rate)
  ).length;

  return {
    title: highestReadingRate.title,
    reading_rate: highestReadingRate.readingRate,
    average_rate: _.sumBy(group[highestReadingRate.title], "rate") / bookRates,
  };
}
module.exports = process;
