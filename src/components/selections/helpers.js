import {
  selectionsFromQuoteAndVerseObjects,
  normalizeString,
} from '../../core/selections/selections';

// const stringify = (array) => array.map(object => JSON.stringify(object));
//export const parsify = (array) => array.map(string => JSON.parse(string));

export const selectionsFromQuote = ({ quote, verseObjects, occurrence }) => {
  let selections = [];

  if (quote && verseObjects && occurrence) {
    selections = selectionsFromQuoteAndVerseObjects({
      quote,
      verseObjects,
      occurrence,
    }).map((selection) => JSON.stringify(selection));
  }
  return selections;
};

export const quoteFromVerse = ({ selections, verseObjects }) => {
  let quotedWords = new Array(verseObjects.length);
  const _selections = selections.map((selection) => JSON.parse(selection).text);

  verseObjects.forEach((verseObject, index) => {
    const { type, text } = verseObject;

    if (type === 'word') {
      const match = _selections.includes(text);
      const quotedWord = match ? text : '…';
      quotedWords.push(quotedWord);
    }
  });

  const quote = quotedWords
    .join(' ')
    .replace(/( ?… ?)+/g, ' … ')
    .replace(/(^[… ]+|[… ]+$)/g, '');
  return quote;
};

// const wordsFromMilestone = ({milestone, quotedWords=[]}) => {
//   const _selections = selections.map(selection => selection.text);
//   if (_selections.include(milestone.content)) {
//     if (milestone.children[0].type === 'word') {
//       const words = milestone.children;
//       words.forEach(word => quotedWords.push(word.text));
//     }
//   }
// };

export const selectionFromWord = (word) => {
  const { content, text, occurrence, occurrences } = word;
  const selectionObject = {
    text: content || text,
    occurrence: parseInt(occurrence),
    occurrences: parseInt(occurrences),
  };
  const selection = JSON.stringify(selectionObject);
  return selection;
};

export const isSelected = ({ word, selections }) => {
  const selection = selectionFromWord(word);
  const selected = selections.includes(selection);
  return selected;
};

export const areSelected = ({ words, selections }) => {
  console.log("---\n---\nareSelected() words, selections", words, selections);
  let selected = false;
  const _selections = words.map((word) => selectionFromWord(word));
  console.log("areSelected() _selections:", _selections);

  for (let j=0; j<_selections.length; j++) {
    const _selection = JSON.parse(_selections[j]);
    let _text = normalizeString(_selection.text);
    let _occ = _selection.occurrence;
    let _occs = _selection.occurrences;
    console.log("areSelected() parsed selection:", _selection);

    for (let i = 0; i < selections.length; i++) {
      const text = selections[i].text; //already normalized.
      const occ = selections[i].occurrence;
      const occs = selections[i].occurrences;
      console.log("areSelected() comparing:", text, " vs ", _text, occ, " vs ", _occ, occs, " vs ", _occs);
      if (text === _text && occ === _occ && occs === _occs) {
        console.log("areSelected() selected is true");
        console.log("...details; text, occ, occs", text, occ, occs);
        console.log("........vs; _text, _occ, _occs", _text, _occ, _occs);
        selected = true;
        break;
      }
    }
    if ( selected ) break;
  }
  if ( !selected ) console.log("areSelected() selected is false");
  /*
  _selections.forEach((selection) => {
    //if (selections.includes(_s)) selected = true;
    const _selection = JSON.parse(selection);
    let _text = normalizeString(_selection.text);
    let _occ = _selection.occurrence;
    let _occs = _selection.occurrences;
    console.log("areSelected() parsed selection:", _selection);

    for (let i = 0; i < selections.length; i++) {
      const text = selections[i].text; //already normalized.
      const occ = selections[i].occurrence;
      const occs = selections[i].occurrences;
      //console.log("areSelected() for loop, selections[i]:", selections[i]);
      if (text === _text && occ === _occ && occs === _occs) {
        console.log("areSelected() match! selected is true, break");
        console.log("areSelected() details; text, occ, occs", text, occ, occs);
        selected = true;
        break;
      }
    }
  });
  */
  return selected;
};

export const addSelection = ({ word, selections }) => {
  let _selections = new Set(selections);
  const selection = selectionFromWord(word);
  _selections.add(selection);
  return [..._selections];
};

export const addSelections = ({ words, selections }) => {
  let _selections = new Set(selections);
  console.log("./helpers.addSelections() new Set(selections):", _selections);

  words.forEach((word) => {
    const selection = selectionFromWord(word);
    console.log("./helpers.addSelections() forEach(word):", word, selection);
    _selections.add(selection);
  });
  //console.log("./helpers.addSelections() returns:", [..._selections]);
  return [..._selections];
};

export const removeSelection = ({ word, selections }) => {
  const selection = selectionFromWord(word);
  const selectionStringified = selections.map((_selection) =>
    selectionFromWord(_selection)
  );
  const _selections = new Set(selectionStringified);
  _selections.delete(selection);
  return [..._selections];
};

export const removeSelections = ({ words, selections }) => {
  const selectionStringified = selections.map((selection) =>
    selectionFromWord(selection)
  );
  const _selections = new Set(selectionStringified);

  words.forEach((word) => {
    const selection = selectionFromWord(word);
    _selections.delete(selection);
  });
  return [..._selections];
};

export default {
  selectionFromWord,
  isSelected,
  areSelected,
  addSelection,
  addSelections,
  removeSelection,
  removeSelections,
};
