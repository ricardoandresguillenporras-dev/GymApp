/**
 * ────────────────────────────────────────────────────────────────────────
 * GymApp Backend — Google Apps Script + Sheets (reemplazo de Supabase)
 * ────────────────────────────────────────────────────────────────────────
 * Tres "tablas" = tres pestañas en este Spreadsheet:
 *   - routines        (rutinas guardadas)
 *   - workout_sessions (historial de entrenos completados)
 *   - workout_photos   (metadata de fotos; el binario va a Drive)
 *
 * Todo está scoped por session_id (igual que Supabase) para que dos
 * dispositivos con el mismo código de pareja compartan la misma data.
 *
 * DEPLOY:
 *   Spreadsheet destino: "Base de Datos Roles"
 *   https://docs.google.com/spreadsheets/d/1VLm6y-cAGm_1E6-1KD5g6kL460jsZzhv42WVlSQY_PY
 *
 *   1. Abre ese Sheet → Extensiones → Apps Script
 *   2. Pega este código como Code.gs
 *   3. Deploy → New deployment → tipo "Web app"
 *      - Execute as: Me
 *      - Who has access: Anyone
 *   4. Copia la URL del web app — esa es tu SHEETS_API_URL en GymApp
 * ────────────────────────────────────────────────────────────────────────
 */

const SHEET_ROUTINES = "routines";
const SHEET_SESSIONS = "workout_sessions";
const SHEET_PHOTOS    = "workout_photos";
const DRIVE_FOLDER_NAME = "GymApp Photos";

// ── Column schemas (orden importa — debe coincidir con los headers) ──────
const SCHEMAS = {
  [SHEET_ROUTINES]: ["id", "session_id", "name", "sub", "emoji", "color", "dark", "duration", "difficulty", "exercises_json", "updated_at"],
  [SHEET_SESSIONS]: ["id", "session_id", "routine_id", "routine_name", "routine_color", "duration_min", "exercises_json", "created_at"],
  [SHEET_PHOTOS]:    ["id", "session_id", "drive_file_id", "public_url", "label", "who", "routine_emoji", "grad_a", "grad_b", "created_at"],
};

// ── Entry points ───────────────────────────────────────────────────────
function doGet(e) {
  try {
    const action = e.parameter.action;
    const sessionId = e.parameter.session_id || "default";

    switch (action) {
      case "loadRoutines":
        return respond(loadRows(SHEET_ROUTINES, sessionId));
      case "loadWorkoutSessions":
        return respond(loadRows(SHEET_SESSIONS, sessionId, Number(e.parameter.limit) || 20));
      case "loadWorkoutPhotos":
        return respond(loadRows(SHEET_PHOTOS, sessionId));
      default:
        return respond({ error: "Unknown action: " + action }, 400);
    }
  } catch (err) {
    return respond({ error: err.message, stack: err.stack }, 500);
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const sessionId = body.session_id || "default";

    switch (action) {
      case "saveRoutines":
        return respond(saveRoutines(body.routines, sessionId));
      case "saveWorkoutSession":
        return respond(saveWorkoutSession(body.session, sessionId));
      case "deleteWorkoutSession":
        return respond(deleteRow(SHEET_SESSIONS, body.id));
      case "uploadWorkoutPhoto":
        return respond(uploadWorkoutPhoto(body.photo, sessionId));
      case "deleteWorkoutPhoto":
        return respond(deleteWorkoutPhoto(body.id));
      default:
        return respond({ error: "Unknown action: " + action }, 400);
    }
  } catch (err) {
    return respond({ error: err.message, stack: err.stack }, 500);
  }
}

// ── Helpers: sheet access ─────────────────────────────────────────────
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(SCHEMAS[name]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function rowsToObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  }).filter(obj => obj.id); // skip blank rows
}

function loadRows(sheetName, sessionId, limit) {
  const sheet = getSheet(sheetName);
  let rows = rowsToObjects(sheet).filter(r => r.session_id === sessionId);

  // Parse JSON columns back into objects/arrays
  rows = rows.map(r => {
    if ("exercises_json" in r) {
      try { r.exercises = JSON.parse(r.exercises_json || "[]"); } catch (e) { r.exercises = []; }
      delete r.exercises_json;
    }
    return r;
  });

  // Sort newest first if there's a created_at/updated_at column
  const dateKey = rows[0] && ("created_at" in rows[0] ? "created_at" : "updated_at" in rows[0] ? "updated_at" : null);
  if (dateKey) {
    rows.sort((a, b) => new Date(b[dateKey]) - new Date(a[dateKey]));
  }

  if (limit) rows = rows.slice(0, limit);
  return rows;
}

function deleteRow(sheetName, id) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return { deleted: true };
    }
  }
  return { deleted: false };
}

function upsertRow(sheetName, idValue, rowObject) {
  const sheet = getSheet(sheetName);
  const headers = SCHEMAS[sheetName];
  const data = sheet.getDataRange().getValues();

  const rowArray = headers.map(h => rowObject[h] !== undefined ? rowObject[h] : "");

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(idValue)) {
      sheet.getRange(i + 1, 1, 1, rowArray.length).setValues([rowArray]);
      return;
    }
  }
  sheet.appendRow(rowArray);
}

// ── routines ───────────────────────────────────────────────────────────
function saveRoutines(routines, sessionId) {
  const now = new Date().toISOString();
  routines.forEach(r => {
    upsertRow(SHEET_ROUTINES, r.id, {
      id: r.id,
      session_id: sessionId,
      name: r.name,
      sub: r.sub || "",
      emoji: r.emoji || "",
      color: r.color,
      dark: r.dark,
      duration: r.duration,
      difficulty: r.difficulty,
      exercises_json: JSON.stringify(r.exercises || []),
      updated_at: now,
    });
  });
  return { saved: routines.length };
}

// ── workout_sessions ──────────────────────────────────────────────────
function saveWorkoutSession(session, sessionId) {
  const id = Utilities.getUuid();
  const now = new Date().toISOString();
  upsertRow(SHEET_SESSIONS, id, {
    id: id,
    session_id: sessionId,
    routine_id: session.routineId,
    routine_name: session.routineName,
    routine_color: session.routineColor,
    duration_min: session.durationMin,
    exercises_json: JSON.stringify(session.exercises || []),
    created_at: now,
  });
  return { id: id, created_at: now };
}

// ── workout_photos (binary → Drive, metadata → Sheet) ────────────────
function getOrCreatePhotoFolder() {
  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  return DriveApp.createFolder(DRIVE_FOLDER_NAME);
}

function uploadWorkoutPhoto(photo, sessionId) {
  // photo.dataURL = "data:image/jpeg;base64,...."
  const match = photo.dataURL.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) throw new Error("Invalid dataURL format");
  const mimeType = match[1];
  const base64 = match[2];

  const blob = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, `${Utilities.getUuid()}.jpg`);
  const folder = getOrCreatePhotoFolder();
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const fileId = file.getId();
  const publicUrl = `https://lh3.googleusercontent.com/d/${fileId}`; // direct-viewable image URL

  const id = Utilities.getUuid();
  const now = new Date().toISOString();
  upsertRow(SHEET_PHOTOS, id, {
    id: id,
    session_id: sessionId,
    drive_file_id: fileId,
    public_url: publicUrl,
    label: photo.label || "",
    who: photo.who || "Tú",
    routine_emoji: photo.emoji || "",
    grad_a: photo.gradA || "",
    grad_b: photo.gradB || "",
    created_at: now,
  });

  return { id: id, public_url: publicUrl, created_at: now };
}

function deleteWorkoutPhoto(id) {
  const sheet = getSheet(SHEET_PHOTOS);
  const rows = rowsToObjects(sheet);
  const row = rows.find(r => String(r.id) === String(id));
  if (row && row.drive_file_id) {
    try {
      DriveApp.getFileById(row.drive_file_id).setTrashed(true);
    } catch (e) { /* file already gone — ignore */ }
  }
  return deleteRow(SHEET_PHOTOS, id);
}

// ── response helper ───────────────────────────────────────────────────
function respond(obj, code) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
