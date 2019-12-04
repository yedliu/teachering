export const defaultNewQuestion = {
  '1': { // eslint-disable-line
    children: [{
      optionList: Array(4).fill(''),
      answerList: [''],
      typeId: '2',
      score: 3,
    }]
  },
  '2': { // eslint-disable-line
    optionList: Array(4).fill(''),
    answerList: [''],
    score: 3,
    stemElementList: []
  },
  '3': { // eslint-disable-line
    answerList: [''],
    score: 3,
  },
  '4': { // eslint-disable-line
    answerList: [''],
    score: 3,
  },
  '5': { // eslint-disable-line
    score: 1,
    children: [{
      score: 1,
      members: []
    },
      {
        score: 1,
        members: []
      }
    ]
  },
  '6': { // eslint-disable-line
    layoutStyle: '2',
    score: 1,
    children: [{
      score: 1,
      members: []
    },
      {
        score: 1,
        members: []
      }
    ]
  },
  '7': { // eslint-disable-line
    score: 0,
    optionList: [],
    answerList: [],
    content: '',
    itemScore: 1,
  },
  '8': { // eslint-disable-line
    optionList: Array(4).fill(''),
    score: 3,
  }
};

export const initState = {
  clickTarget: {
    target: '',
    index: -1,
    i: -1,
    property: '',
    scrollTop: 0,
    degree: '',
    value: '',
    questionItem: '',
  },
  showTree: {
    show: false,
    type: '',
    degree: '',
    index: -1,
    oldValue: '',
  },
  showEditor: true,
  formulaBoxPosition: {
    x: '100px',
    y: '100px',
  },
  seeFormulaModal: false,
  momeryPosition: {
    detX: 0,
    detY: 0,
    x: 0,
    y: 0,
  },
  showPreview: false,
};
