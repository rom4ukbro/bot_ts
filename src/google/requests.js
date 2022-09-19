const {
  absenceLess,
  explanatoryNote,
  individualTraining,
  distanceLearning,
  chooseSpecialty,
  deductionsStudent,
  renewalStudent,
  rearrangementTest,
  academicLeave,
  transferSession,
} = require('../Bot/Scene/statementScene/statementText');

function getRequests(payload) {
  const req = {
    [absenceLess]: [
      {
        replaceAllText: {
          containsText: {
            text: '{{inGenitive}}',
            matchCase: true,
          },
          replaceText: payload.inGenitive,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{phone}}',
            matchCase: true,
          },
          replaceText: payload.phone,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{group}}',
            matchCase: true,
          },
          replaceText: payload.group,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{sDate}}',
            matchCase: true,
          },
          replaceText: payload.sDate,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{eDate}}',
            matchCase: true,
          },
          replaceText: payload.eDate,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{reason}}',
            matchCase: true,
          },
          replaceText: payload.reason,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{createDate}}',
            matchCase: true,
          },
          replaceText: payload.createDate,
        },
      },
    ],
    [explanatoryNote]: [
      {
        replaceAllText: {
          containsText: {
            text: '{{pib}}',
            matchCase: true,
          },
          replaceText: payload.pib,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{inGenitive}}',
            matchCase: true,
          },
          replaceText: payload.inGenitive,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{phone}}',
            matchCase: true,
          },
          replaceText: payload.phone,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{group}}',
            matchCase: true,
          },
          replaceText: payload.group,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{absenceDate}}',
            matchCase: true,
          },
          replaceText: payload.sDate,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{reason}}',
            matchCase: true,
          },
          replaceText: payload.reason,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{createDate}}',
            matchCase: true,
          },
          replaceText: payload.createDate,
        },
      },
    ],
    [individualTraining]: [
      {
        insertInlineImage: {
          uri: payload.uri,
          endOfSegmentLocation: {},
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{add}}',
            matchCase: true,
          },
          replaceText: payload.add,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{inGenitive}}',
            matchCase: true,
          },
          replaceText: payload.inGenitive,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{phone}}',
            matchCase: true,
          },
          replaceText: payload.phone,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{group}}',
            matchCase: true,
          },
          replaceText: payload.group,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{reason}}',
            matchCase: true,
          },
          replaceText: payload.reason,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{createDate}}',
            matchCase: true,
          },
          replaceText: payload.createDate,
        },
      },
    ],
    [distanceLearning]: [
      {
        replaceAllText: {
          containsText: {
            text: '{{inGenitive}}',
            matchCase: true,
          },
          replaceText: payload.inGenitive,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{phone}}',
            matchCase: true,
          },
          replaceText: payload.phone,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{group}}',
            matchCase: true,
          },
          replaceText: payload.group,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{reason}}',
            matchCase: true,
          },
          replaceText: payload.reason,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{createDate}}',
            matchCase: true,
          },
          replaceText: payload.createDate,
        },
      },
    ],
    [chooseSpecialty]: [
      {
        replaceAllText: {
          containsText: {
            text: '{{inGenitive}}',
            matchCase: true,
          },
          replaceText: payload.inGenitive,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{phone}}',
            matchCase: true,
          },
          replaceText: payload.phone,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{group}}',
            matchCase: true,
          },
          replaceText: payload.group,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{withForm}}',
            matchCase: true,
          },
          replaceText: payload.withForm,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{toForm}}',
            matchCase: true,
          },
          replaceText: payload.toForm,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{withSpecialty}}',
            matchCase: true,
          },
          replaceText: payload.withSpecialty,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{toSpecialty}}',
            matchCase: true,
          },
          replaceText: payload.toSpecialty,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{createDate}}',
            matchCase: true,
          },
          replaceText: payload.createDate,
        },
      },
    ],
    [deductionsStudent]: [
      {
        replaceAllText: {
          containsText: {
            text: '{{inGenitive}}',
            matchCase: true,
          },
          replaceText: payload.inGenitive,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{phone}}',
            matchCase: true,
          },
          replaceText: payload.phone,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{group}}',
            matchCase: true,
          },
          replaceText: payload.group,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{withForm}}',
            matchCase: true,
          },
          replaceText: payload.withForm,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{withCourse}}',
            matchCase: true,
          },
          replaceText: payload.withCourse,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{withSpecialty}}',
            matchCase: true,
          },
          replaceText: payload.withSpecialty,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{absenceDate}}',
            matchCase: true,
          },
          replaceText: payload.absenceDate,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{createDate}}',
            matchCase: true,
          },
          replaceText: payload.createDate,
        },
      },
    ],
    [renewalStudent]: [
      {
        replaceAllText: {
          containsText: {
            text: '{{inGenitive}}',
            matchCase: true,
          },
          replaceText: payload.inGenitive,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{phone}}',
            matchCase: true,
          },
          replaceText: payload.phone,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{group}}',
            matchCase: true,
          },
          replaceText: payload.group,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{withForm}}',
            matchCase: true,
          },
          replaceText: payload.withForm,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{withCourse}}',
            matchCase: true,
          },
          replaceText: payload.withCourse,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{withSpecialty}}',
            matchCase: true,
          },
          replaceText: payload.withSpecialty,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{absenceDate}}',
            matchCase: true,
          },
          replaceText: payload.absenceDate,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{createDate}}',
            matchCase: true,
          },
          replaceText: payload.createDate,
        },
      },
    ],
    [rearrangementTest]: [
      {
        replaceAllText: {
          containsText: {
            text: '{{inGenitive}}',
            matchCase: true,
          },
          replaceText: payload.inGenitive,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{phone}}',
            matchCase: true,
          },
          replaceText: payload.phone,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{group}}',
            matchCase: true,
          },
          replaceText: payload.group,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{discipline}}',
            matchCase: true,
          },
          replaceText: payload.discipline,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{createDate}}',
            matchCase: true,
          },
          replaceText: payload.createDate,
        },
      },
    ],
    [academicLeave]: [
      {
        replaceAllText: {
          containsText: {
            text: '{{inGenitive}}',
            matchCase: true,
          },
          replaceText: payload.inGenitive,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{phone}}',
            matchCase: true,
          },
          replaceText: payload.phone,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{group}}',
            matchCase: true,
          },
          replaceText: payload.group,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{reason}}',
            matchCase: true,
          },
          replaceText: payload.reason,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{createDate}}',
            matchCase: true,
          },
          replaceText: payload.createDate,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{sDate}}',
            matchCase: true,
          },
          replaceText: payload.sDate,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{eDate}}',
            matchCase: true,
          },
          replaceText: payload.eDate,
        },
      },
    ],
    [transferSession]: [
      {
        replaceAllText: {
          containsText: {
            text: '{{inGenitive}}',
            matchCase: true,
          },
          replaceText: payload.inGenitive,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{phone}}',
            matchCase: true,
          },
          replaceText: payload.phone,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{group}}',
            matchCase: true,
          },
          replaceText: payload.group,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{reason}}',
            matchCase: true,
          },
          replaceText: payload.reason,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{createDate}}',
            matchCase: true,
          },
          replaceText: payload.createDate,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{sDate}}',
            matchCase: true,
          },
          replaceText: payload.sDate,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{eDate}}',
            matchCase: true,
          },
          replaceText: payload.eDate,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{sem}}',
            matchCase: true,
          },
          replaceText: payload.sem,
        },
      },
      {
        replaceAllText: {
          containsText: {
            text: '{{academicYears}}',
            matchCase: true,
          },
          replaceText: payload.academicYears,
        },
      },
    ],
  };

  let res = req[payload.docName];

  if (payload.docName == academicLeave || payload.docName == transferSession) {
    const photo = {
        insertInlineImage: {
          uri: payload.uri,
          endOfSegmentLocation: {},
        },
      },
      noPhoto = {
        replaceAllText: {
          containsText: {
            text: 'До заяви додаю: скан прикріплений нижче.',
            matchCase: true,
          },
          replaceText: '',
        },
      };

    payload.uri ? res.push(photo) : res.push(noPhoto);
  }

  return res;
}

module.exports = { getRequests };
