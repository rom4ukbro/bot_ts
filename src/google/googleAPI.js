const fs = require('fs');
const readline = require('readline-sync');
const Docs = require('@googleapis/docs');
const Drive = require('@googleapis/drive');
const Sheets = require('@googleapis/sheets');

const { getRequests } = require('./requests');

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
];

const TOKEN_PATH = __dirname + '/token.json';

const STATEMENT_FOLDER_ID = process.env.STATEMENT_FOLDER_ID;

// (async () => {
//   try {
//     console.log(await googleApis('checkPhone', { phone: '+380959369733' }));
//   } catch (e) {
//     console.log(e);
//   }
// })();

/**
 *
 * @param {String} mode Work mode
 *
 * @param {Object} payload The Payload
 */
async function googleApis(mode, payload) {
  switch (mode) {
    case 'checkPhone':
      callback = checkPhone;
      break;
    case 'generateDocs':
      callback = generateDocs;
  }

  return await authorize(callback, payload);
}

async function authorize(callback, payload) {
  const credentials = fs.readFileSync(__dirname + '/credentials.json');
  const { client_secret, client_id, redirect_uris } = JSON.parse(credentials).installed;
  const oAuth2Client = new Docs.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    var tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
  } catch (err) {
    return getAccessToken(oAuth2Client, callback, payload);
  }
  try {
    oAuth2Client.setCredentials(tokens);
  } catch (e) {
    return { status: 'failed' };
  }

  return await callback(oAuth2Client, payload);
}

async function getAccessToken(oAuth2Client, callback, payload) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);

  const code = readline.question('Enter the code from that page here: ');

  const tokens = await oAuth2Client.getToken(code);

  oAuth2Client.setCredentials(tokens);

  fs.writeFile(TOKEN_PATH, JSON.stringify(tokens.tokens), (err) => {
    if (err) return console.error(err);
    console.log('Token stored to', TOKEN_PATH);
  });

  return await callback(oAuth2Client, payload);
}

async function generateDocs(auth, payload) {
  const docs = Docs.docs({ version: 'v1', auth });
  const drive = Drive.drive({ version: 'v3', auth });

  const sourceId = await getFilesId(auth, payload.docName);

  const metadata = {
    title: `${payload.docName} ${payload.pib}`,
    name: `${payload.docName} ${payload.pib}`,
    parents: [STATEMENT_FOLDER_ID],
  };

  try {
    var copyFile = await drive.files.copy(
      {
        fileId: sourceId,
        requestBody: metadata,
      },
      {
        fields: 'id',
      },
    );
  } catch (e) {
    return { status: 'failed' };
  }

  const requests = getRequests(payload);

  try {
    var result = await docs.documents.batchUpdate({
      auth,
      documentId: copyFile.data.id,
      requestBody: {
        requests,
      },
    });
  } catch (e) {
    console.log(e);
    return { status: 'failed' };
  }

  return {
    status: 'OK',
    url: `https://docs.google.com/document/d/${result?.data?.documentId}/edit`,
  };
}

async function checkPhone(auth, payload) {
  const sheets = Sheets.sheets({ version: 'v4', auth });
  const { phone } = payload;

  id = await getFilesId(auth, 'Список студентів');

  res = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: 'Всі студенти!AA2:AA',
  });

  const rows = res?.data?.values;

  if (rows?.length) {
    rows.forEach((row, index, array) => (array[index] = row[0]));
    var row = rows.indexOf(phone);
  } else {
    return null;
  }

  if (row !== -1) {
    res = await sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range: `Всі студенти!A${row + 2}:O${row + 2}`,
    });

    const rows = res?.data?.values;

    if (rows?.length) {
      return rows[0];
    } else {
      return null;
    }
  } else {
    return { notFound: true };
  }
}

function getFilesId(auth, fileName) {
  return new Promise((resolve, reject) => {
    const drive = Drive.drive({ version: 'v3', auth });

    drive.files.list(
      {
        q: `name = "${fileName}"`,
        pageSize: 100,
        fields: 'nextPageToken, files(id, name)',
      },
      (err, res) => {
        if (err) {
          console.log('The drive API returned an error: ' + err);
          return reject({ status: 'failed' });
        }
        const files = res.data.files;
        if (files?.length) {
          files.map((file) => {
            return resolve(file.id);
          });
        } else {
          console.log('No files found.');
          return reject({ status: 'failed' });
        }
      },
    );
  });
}

module.exports = { googleApis };
