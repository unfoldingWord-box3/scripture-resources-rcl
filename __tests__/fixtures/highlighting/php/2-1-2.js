module.exports = {
    book:"php",
    chapter:2,
    verse:1,
    quote:"εἴ…εἴ…εἴ…εἴ",
    occurrence:1,
    expected:
      [
        {
          "text": "εἴ",
          "occurrence": 1,
          "occurrences": 4
        },
        {
          "text": "εἴ",
          "occurrence": 2,
          "occurrences": 4
        },
        {
          "text": "εἴ",
          "occurrence": 3,
          "occurrences": 4
        },
        {
          "text": "εἴ",
          "occurrence": 4,
          "occurrences": 4
        }
      ]
}