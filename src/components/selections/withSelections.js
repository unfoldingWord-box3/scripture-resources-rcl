import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import deepFreeze from 'deep-freeze';

import helpers, {parsify, selectionsFromQuote, quoteFromVerse} from './helpers';

function withSelections(Component){
  return function SelectionsComponent({
    quote,
    occurrence,
    onQuote,
    verseObjects,
    ...props
  }) {
    const [selections, setSelections] = useState([]);

    useEffect(() => {
      const _selections = selectionsFromQuote({quote, verseObjects, occurrence});
      setSelections(_selections);
    },[quote, occurrence, verseObjects]);

    useEffect(() => {
      if (verseObjects && onQuote) {
        const _quote = quoteFromVerse({selections, verseObjects});
        onQuote(_quote);
      }
    }, [selections, onQuote, verseObjects]);

    const isSelected = (word) => helpers.isSelected({word, selections});

    const areSelected = (words) => helpers.areSelected({words, selections});

    const addSelection = (word) => {
      let _selections = helpers.addSelection({word, selections});
      setSelections(_selections);
    };

    const addSelections = (words) => {
      let _selections = helpers.addSelections({words, selections});
      setSelections(_selections);
    };

    const removeSelection = (word) => {
      const _selections = helpers.removeSelection({word, selections});
      setSelections(_selections);
    };

    const removeSelections = (words) => {
      let _selections = helpers.removeSelections({words, selections});
      setSelections(_selections);
    };

    const _selections = deepFreeze(parsify(selections));

    const value = {
      selections: _selections,
      isSelected,
      areSelected,
      addSelection,
      addSelections,
      removeSelection,
      removeSelections,
    };

    return (
      <Component value={value} {...props} />
    );
  }
}

withSelections.propTypes = {
  quote: PropTypes.string.isRequired,
  quoteVerseObjects: PropTypes.array,
  onQuote: PropTypes.func,
};

withSelections.defaultProps = {
  selections: [],
};

export default withSelections;
