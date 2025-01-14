## Using Contexts

To see highlighting appear, change the `-1` occurrence to 1;
then click or tab out of field.

To add resources to the RCL, please see the following sample paths:  
`Door43-Catalog/hi/ulb/master/php`  
`STR/hi/irv/master/php`  
To add resources to the app, please omit bookId from the end:  
`Door43-Catalog/hi/ulb/master`  
`STR/hi/irv/master`

```js
import { TextField } from '@material-ui/core';
import {
  ParallelScripture,
  ResourcesContext,
  ResourcesContextProvider,
} from 'scripture-resources-rcl';
import useEffect from 'use-deep-compare-effect';

// Required parameters
const bookId = "tit";
const occurrence = -1;
const defaultQuote = "ἐφανέρωσεν & τὸν λόγον αὐτοῦ"

// for changing the postion of resource in scripture RCL
// to display the orginal language to first, ORIGINAL_LANG_POSITION = 1 also read line no 46
// default "0" - orignal language will be displayed last 
const ORIGINAL_LANG_POSITION = 0;

const bcvQuery = {
  book: {
    [bookId]: {
      ch: {
        1: {
          v: {
            3: {}
          }
        }
      },
    },
  },
}
const path = { ot: "hbo/uhb", nt: "el-x-koine/ugnt" };
// To change the position of scripture resource in the panel, move the elements in different index in allResourceLinks
// eg move "originalLink" to the last index to move hebrew / greek to last 
const defaultResourceLinks = [
  `unfoldingWord/en/ult/master/${bookId}`,
  `https://git.door43.org/unfoldingWord/en_ust/src/branch/master`,
  `unfoldingWord/${path.nt}/master/${bookId}`,
];

// Usage
function Component() {
  const [quote, setQuote] = React.useState(defaultQuote);
  const [resources, setResources] = React.useState([]);
  const [resourceLinks, setResourceLinks] = React.useState(defaultResourceLinks);
  const reference = { bookId, chapter: 1, verse: "3", bcvQuery };
  const config = { server: 'https://git.door43.org' };

  return (
    <ResourcesContextProvider
      reference={reference}
      defaultResourceLinks={defaultResourceLinks}
      resourceLinks={resourceLinks}
      onResourceLinks={setResourceLinks}
      resources={resources}
      onResources={setResources}
      config={config}
      ORIGINAL_LANG_POSITION = {ORIGINAL_LANG_POSITION}
    >
      <p>Quote: {quote}</p>
      <p>Occurrence: {occurrence}</p>
       <ParallelScripture
        reference={reference}
        quote={quote}
        onQuote={setQuote}
        occurrence={occurrence}
        height="250px"
        />
    </ResourcesContextProvider>
  );
}

<Component/>
```

## ParallelScripture Playground

A dynamic example

```js
import { TextField,Select,InputLabel,FormControl,MenuItem } from '@material-ui/core';
import {
  ParallelScripture,
  ResourcesContextProvider,
} from 'scripture-resources-rcl';

// DEFAULT VALUES
const defaults = {
  bookId: "jud",
  lang: "nt", //ot or nt
  chapter: "1",
  verse: "10",
  quote: "ὅσα & φυσικῶς ὡς τὰ ἄλογα ζῷα ἐπίστανται",
  occurrence: 2
}

// Constants
const path = { ot: "hbo/uhb", nt: "el-x-koine/ugnt" };
const config = { server: 'https://git.door43.org' };

function Component({ }) {
  const [bookId, setBookId] = React.useState(defaults.bookId);
  const [lang,setLang] = React.useState(defaults.lang); //ot or nt
  const [chapter, setChapter] = React.useState(defaults.chapter);
  const [verse, setVerse] = React.useState(defaults.verse);
  const [quote, setQuote] = React.useState(defaults.quote);
  const [occurrence, setOccurrence] = React.useState(defaults.occurrence);
  const [resources, setResources] = React.useState([]);

  const verseObject = React.useMemo(() => verse.split(/,/).reduce((v,st) => {
    const span = st.split("-");
    if(span.length > 1) for(let i = Number(span[0]); i <= Number(span[1]); i++) v[i] = {}
    if(span.length === 1) v[Number(span[0])] = {}
    return v
  },{}), [verse])

  // for changing the postion of resource in scripture RCL
// to display the orginal language to first, ORIGINAL_LANG_POSITION = 1 also read line no 46
  // default "0" - orignal language will be displayed last 
  const ORIGINAL_LANG_POSITION = 0;

  const bcvQuery = React.useMemo(() => ({
    book: {
      [bookId]: {
        ch: {
          [Number(chapter)]: {
            v: verseObject
          }
        },
      },
    },
  }), [bookId,chapter,verse]);

  const reference = React.useMemo(() => ({ bookId, chapter: Number(chapter), verse, bcvQuery }), [bookId, bcvQuery, chapter, verse]);

  const defaultResourceLinks = React.useMemo(() => [
    `unfoldingWord/en/ult/master/${bookId}`,
    `https://git.door43.org/unfoldingWord/en_ust/src/branch/master`,
    `unfoldingWord/${path[lang]}/master/${bookId}`,
  ],[bookId,lang,path]);

  const [resourceLinks, setResourceLinks] = React.useState(defaultResourceLinks);
  React.useEffect(() => { setResourceLinks(defaultResourceLinks) },[defaultResourceLinks]);

  return (
    <ResourcesContextProvider
      reference={reference}
      resourceLinks={resourceLinks}
      defaultResourceLinks={defaultResourceLinks}
      onResourceLinks={setResourceLinks}
      resources={resources}
      onResources={setResources}
      config={config}
      ORIGINAL_LANG_POSITION = {ORIGINAL_LANG_POSITION}
    >         
      <ExampleUiForm
        bookId={bookId}
        onChangeBookId={setBookId}
        quote={quote}
        onChangeQuote={setQuote}
        occurrence={occurrence}
        onChangeOccurrence={setOccurrence}
        lang={lang}
        onChangeLang={setLang}
        chapter={chapter}
        onChangeChapter={setChapter}
        verse={verse}
        onChangeVerse={setVerse}
      />
      <ParallelScripture
      reference={reference}
      quote={quote}
      onQuote={setQuote}
      occurrence={occurrence}
      height="250px"
      />
    </ResourcesContextProvider>
  );
}

// A sample form to allow users to play with different parameters 
const ExampleUiForm = ({
  bookId,
  onChangeBookId,
  quote,
  onChangeQuote,
  occurrence,
  onChangeOccurrence,
  lang,
  onChangeLang,
  chapter,
  onChangeChapter,
  verse,
  onChangeVerse,
}) => {
  return (
    <>
      <form noValidate autoComplete="off">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1em", padding: '1em 0' }}>
          <TextField
            id="bookId"
            label="BookId"
            variant="outlined"
            defaultValue={bookId}
            onBlur={(event) => onChangeBookId(event.target.value)}
          />
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-label">Original Language</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={lang}
              onChange={(e) => onChangeLang(e.target.value)}
            >
              <MenuItem value={"ot"}>Hebrew</MenuItem>
              <MenuItem value={"nt"}>Greek</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="chapter"
            label="chapter"
            variant="outlined"
            defaultValue={chapter}
            onBlur={(event) => onChangeChapter(Number(event.target.value))}
            fullWidth
          />
          <TextField
            id="verse"
            label="verse"
            variant="outlined"
            defaultValue={verse}
            onBlur={(event) => onChangeVerse(event.target.value)}
            fullWidth
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1em",padding: '1em 0' }}>
          <TextField
            id="quote"
            label="Quote"
            variant="outlined"
            defaultValue={quote}
            onBlur={(event) => onChangeQuote(event.target.value)}
            fullWidth
          />
          <TextField
            id="occurrence"
            label="Occurrence"
            variant="outlined"
            defaultValue={occurrence}
            onBlur={(event) => onChangeOccurrence(parseInt(event.target.value))}
          />
        </div>
      </form>
    </>
  )
}

<Component/>
```
