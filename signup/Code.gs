/**
 * Data as Material · Reading presentation sign-up
 * Google Apps Script web app used as a small JSON service by the sign-up
 * page (signup/index.html, hosted on GitHub Pages). It reads and writes the
 * sign-up Google Sheet and emails each student a confirmation.
 *
 *   GET  .../exec            -> { ok: true, weeks: [...] }
 *   POST .../exec  body: {"row":2,"slot":0,"name":"...","email":"..."}
 *                            -> { ok: true, weeks: [...], emailed: true }
 *   Errors come back as      -> { ok: false, error: "message" }
 *
 * Sheet layout (row 1 = header, one row per discussion week):
 *   A Week · B Date · C Readings · D Presenter 1 · E Presenter 2
 * A Presenter cell that says "(one presenter)" is closed.
 */

var SHEET_ID = '1ZyTZ14n44gbP8SEKLsZoSDLVimCqKJn5nYJWt7U_A2A';
var FIRST_ROW = 2;
var LAST_ROW = 9;
var CLOSED = '(one presenter)';
var REPLY_TO = 'regina.flores@newschool.edu';
var SYLLABUS = 'https://reginaflores.github.io/Data_As_Material/';

function doGet() {
  return json_(function () { return { weeks: getWeeks() }; });
}

function doPost(e) {
  return json_(function () {
    var b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    return signUp(b.row, b.slot, b.name, b.email);
  });
}

function json_(fn) {
  var out;
  try {
    out = fn();
    out.ok = true;
  } catch (err) {
    out = { ok: false, error: String(err && err.message ? err.message : err) };
  }
  return ContentService.createTextOutput(JSON.stringify(out))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheet_() {
  return SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
}

/** Returns every week with its readings and both presenter slots. */
function getWeeks() {
  var values = sheet_()
    .getRange(FIRST_ROW, 1, LAST_ROW - FIRST_ROW + 1, 5)
    .getDisplayValues();
  return values.map(function (r, i) {
    return {
      row: FIRST_ROW + i,
      week: r[0],
      date: r[1],
      readings: r[2],
      slots: [r[3], r[4]].map(function (v) {
        return { name: v === CLOSED ? '' : v, closed: v === CLOSED };
      })
    };
  });
}

/**
 * Puts a name in one empty slot (slot is 0 or 1), then emails the student
 * a confirmation. Returns { weeks, emailed }.
 */
function signUp(row, slot, name, email) {
  name = String(name || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  email = String(email || '').trim().slice(0, 120);
  if (!name) throw new Error('Type your name first.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Type a valid email so we can send your confirmation.');
  row = Number(row);
  slot = Number(slot);
  if (row < FIRST_ROW || row > LAST_ROW || (slot !== 0 && slot !== 1)) {
    throw new Error('That spot does not exist.');
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var weeks = getWeeks();
    var taken = weeks.some(function (w) {
      return w.slots.some(function (s) {
        return s.name.toLowerCase() === name.toLowerCase();
      });
    });
    if (taken) throw new Error(name + ' is already signed up. Everyone presents once.');

    var cell = sheet_().getRange(row, 4 + slot);
    var current = cell.getDisplayValue();
    if (current === CLOSED) throw new Error('That week takes one presenter.');
    if (current) throw new Error('Someone just took that spot. Pick another.');
    cell.setValue(name);
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }

  var week = getWeeks().filter(function (w) { return w.row === row; })[0];
  var emailed = true;
  try {
    sendConfirmation_(name, email, week);
  } catch (e) {
    emailed = false; // the sign-up still counts; the page says the email failed
  }
  return { weeks: getWeeks(), emailed: emailed };
}

function sendConfirmation_(name, email, week) {
  var readings = week.readings.split(/;\s*/).map(function (r) { return '  - ' + r; }).join('\n');
  var body =
    'Hi ' + name + ',\n\n' +
    'You are signed up to present the readings in Data as Material (PSAM 5170).\n\n' +
    week.week + ': ' + week.date + ', 4:00 p.m.\n\n' +
    'Readings to present:\n' + readings + '\n\n' +
    'Present all of these readings, not just one: summarize each, pick the passages that matter, and bring questions for the class. If you share the week with someone, split the work but cover every reading between you.\n\n' +
    'Links to every reading are in the syllabus: ' + SYLLABUS + '\n\n' +
    'Need to switch weeks? Reply to this email.\n\n' +
    'Regina';
  MailApp.sendEmail({
    to: email,
    replyTo: REPLY_TO,
    name: 'Data as Material',
    subject: 'Reading presentation: ' + week.week + ', ' + week.date,
    body: body
  });
}
