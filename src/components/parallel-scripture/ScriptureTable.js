import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import {
  ShortText,
  Subject,
  ViewColumn,
} from '@material-ui/icons';
import {
  Table,
  TableBody,
} from '@material-ui/core';

import {
  Row,
  Headers,
  Toolbar,
  ColumnsMenu,
} from '..';
import {
  referenceIdsFromBooks,
  referenceIdFromReference,
  versesFromReferenceIdAndBooks,
} from './helpers';
import withSelections from '../selections/withSelections';
import {SelectionsProvider} from '../selections/Selections.context';

const Selectionable = withSelections(SelectionsProvider);

function ScriptureTable ({
  title,
  titles,
  books,
  height,
  reference,
  quote,
  onQuote,
  occurrence,
  buttons,
}) {
  const classes = useStyles();
  const [filter, setFilter] = useState(!!reference);
  const [referenceIds, setReferenceIds] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnsMenuAnchorEl, setColumnsMenuAnchorEl] = useState();

  let verseObjects = [];
  if (reference && books[0] && books[0].chapters && books[0].chapters[reference.chapter]) {
    verseObjects = books[0].chapters[reference.chapter][reference.verse].verseObjects;
  }

  useEffect(() => {
    const _columns = titles.map((title, index) => ({id: index, label: title}));
    setColumns(_columns);
  }, [titles]);

  useEffect(() => {
    const _referenceIds = referenceIdsFromBooks({books});
    setReferenceIds(_referenceIds);
  }, [books]);

  const actions = [
    {
      icon: <ViewColumn fontSize='small' />,
      tooltip: 'Select Versions',
      onClick: (event) => setColumnsMenuAnchorEl(event.currentTarget),
      menu: (
        <ColumnsMenu
          columns={columns}
          onColumns={setColumns}
          anchorEl={columnsMenuAnchorEl}
          onAnchorEl={setColumnsMenuAnchorEl}
        />
      ),
    },
    {
      icon: filter ? <ShortText fontSize='small' /> : <Subject fontSize='small' />,
      tooltip: 'Toggle Reference View',
      onClick: (event) => setFilter(!filter),
    },
  ];

  const _referenceIds = filter ? [referenceIdFromReference(reference)] : referenceIds;
  const rows = _referenceIds.map(referenceId => {
    const verses = versesFromReferenceIdAndBooks({referenceId, books});
    const row = (
      <Row
        key={referenceId}
        verses={verses}
        referenceId={referenceId}
        reference={reference}
        filter={filter}
        columns={columns}
      />
    );
    return row;
  });

  useEffect(() => {
    const scrollReferenceId = referenceIdFromReference(reference);
    if (!filter) {
      const element = document.getElementById(scrollReferenceId);
      if (element) {
        element.scrollIntoView(true);
        document.getElementById('wrapY').scrollTop -= 30;
      }
    }
  }, [filter, reference]);

  return (
    <Selectionable
      quote={quote}
      // onQuote={onQuote} // disable until round trip is working
      occurrence={occurrence}
      verseObjects={verseObjects}
    >
      <Toolbar title={title} actions={actions} buttons={buttons} />
      <div id='wrapY' className={classes.wrapY} style={{maxHeight: height}} >
        <Table className={classes.table}>
          <Headers columns={columns} />
          <TableBody className={classes.tableBody}>
            {rows}
          </TableBody>
        </Table>
      </div>
    </Selectionable>
  );
}

ScriptureTable.propTypes = {
  titles: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      headers: PropTypes.array.isRequired,
      chapters: PropTypes.object.isRequired,
    })  
  ).isRequired,
  /** the reference to scroll into view */
  reference: PropTypes.shape({
    bookId: PropTypes.string,
    chapter: PropTypes.number,
    verse: PropTypes.number,
  }),
  /** bypass rendering only when visible */
  renderOffscreen: PropTypes.bool,
  /** render unsupported usfm markers */ 
  showUnsupported: PropTypes.bool,
  /** override text direction detection */
  direction: PropTypes.string,
  /** disable popovers for aligned and original language words */
  disableWordPopover: PropTypes.bool,
  /** filter the view to the reference */
  filter: PropTypes.bool,
  /** pass the quote in from parent state */
  quote: PropTypes.string,
  /** callback to return the quote when selections made */
  onQuote: PropTypes.func,
};

const useStyles = makeStyles(theme => ({
  root: {
  },
  wrapY: {
    overflowY: 'auto',
    overflowX: 'auto',
  },
  table: {
  },
  tableBody:{
  }
}));

export default ScriptureTable;