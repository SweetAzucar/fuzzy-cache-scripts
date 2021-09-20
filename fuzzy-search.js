/*
---- EXCERCISE:
Given a relational database table that has 5 fields,
write a javascript snippet/function that performs a fuzzy
search of a string throughout all the records retrieved by 
a query (assume we loaded the full table in a variable called "records")

* Readers notes:
  * fuzzySearch takes 4 parameters, first is the word to search, second 
    it's a special structure containing the records, 
    third is an optional param which defines n for the
    ngrams that are going to be built inside the algorithm, and fourth, 
    a threshold for the approximation.
  * The function builds a structure where then it finds the match. The algorithm
    was built over the assumption that many searches would take place, making it 
    more efficient to search.


  Assumptions:
  1) For the given variable records, the input comes as an array of jsons,
  where the dimension of the matrix is nx5 (n rows and 5 columns).
  2) The search is over all entries, and it should return one or more.

*/

const records = [
  {
    brand: "apple",
    title: "iphone 9",
    description: "really good phone",
    seller: "Mark Applier",
    courier: "DHL",
  },
  {
    brand: "apple",
    title: "iphone 11",
    description: "it's in good condition",
    seller: "Robert Jason",
    courier: "FEDEX",
  },
  {
    brand: "apple",
    title: "iphone X",
    description: "it's a counterfeit ",
    seller: "Chad Chester",
    courier: "DHL",
  },
  {
    brand: "samsung",
    title: "Galaxy s20",
    description: "better than an iphone for sure!",
    seller: "Jack Killer",
    courier: "USPS",
  },
  {
    brand: "samsung",
    title: "Note s20",
    description: "excellent phone",
    seller: "Mark Applier",
    courier: "DHL",
  },
  {
    brand: "motorola",
    title: "X99",
    description: "really good phone",
    seller: "Mark Applier",
    courier: "FEDEX",
  },
];

console.log(fuzzySearch("iphone", indexing(records)).next().value);

// ------ IMPLEMENTATION -------

function* fuzzySearch(word, gramsDict, n = 2, threshold = 0.5) {
  let wordGrams = ngrams(word, n);
  let totalGrams = wordGrams.length;
  let suggestions = {};

  wordGrams.forEach((gram) => {
    if (gram in gramsDict) {
      gramsDict[gram].forEach((suggestion) => {
        if (suggestion in suggestions) {
          suggestions[suggestion] += 1;
        } else {
          suggestions[suggestion] = 1;
        }
      });
    }
  });

  for (const [suggestion, gramCount] of Object.entries(suggestions)) {
    const percentage = gramCount / totalGrams;
    if (percentage >= threshold) {
      yield suggestion;
    }
  }
}

function indexing(records, n = 2) {
  let gramsDict = {};
  records.forEach((row) => {
    Object.values(row).forEach((colVal) => {
      colVal = colVal.toLowerCase();
      const grams = ngrams(colVal, n);
      grams.forEach((gram) => {
        gram = gram.toLowerCase();
        if (gram in gramsDict) {
          gramsDict[gram].push(colVal);
        } else {
          gramsDict[gram] = [colVal];
        }
      });
    });
  });
  return gramsDict;
}

function ngrams(word, n) {
  let nGrams = [];
  let index;

  if (word === null || word === undefined) {
    return nGrams;
  }

  const source = word.slice ? word : String(word);
  index = source.length - n + 1;

  if (index < 1) {
    return nGrams;
  }

  while (index--) {
    nGrams[index] = source.slice(index, index + n);
  }

  return nGrams;
}
