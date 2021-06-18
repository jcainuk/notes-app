import moment from 'moment';
import getFilters from './filters';
import { sortNotes, getNotes } from './notes';

// Generate the last edited message
const generateLastEdited = (timestamp) => `Last edited ${moment(timestamp).fromNow()}`;

// Generate the DOM structure for a note
const generateNoteDOM = (note) => {
  const noteElement = document.createElement('a');
  const textElement = document.createElement('p');
  const statusElement = document.createElement('p');

  // Set up the note title text
  // If the note has a title then put in inside the paragraph
  if (note.title.length > 0) {
    textElement.textContent = note.title;
    // Else give the note a generic title 'Unnamed note'
  } else {
    textElement.textContent = 'Unnamed note';
  }
  textElement.classList.add('list-item__title');

  noteElement.appendChild(textElement);

  // Set up the link
  noteElement.setAttribute('href', `/edit.html#${note.id}`);
  noteElement.classList.add('list-item');

  // Set up the status message
  statusElement.textContent = generateLastEdited(note.updatedAt);
  statusElement.classList.add('list-item__subtitle');
  noteElement.appendChild(statusElement);

  return noteElement;
};

// application notes
const renderNotes = () => {
  const notesEl = document.querySelector('#notes');
  const filters = getFilters();
  const notes = sortNotes(filters.sortBy);

  // Limit the displayed notes to just those that pass our filters
  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(filters.searchText.toLowerCase()));

  // Delete all contents of our notes div
  notesEl.innerHTML = '';

  if (filteredNotes.length > 0) {
    // Create paragraph element for each filtered note
    filteredNotes.forEach((note) => {
      const noteElement = generateNoteDOM(note);
      notesEl.appendChild(noteElement);
    });
  } else {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No notes to show';
    emptyMessage.classList.add('empty-message');
    notesEl.appendChild(emptyMessage);
  }
};

const initializeEditPage = (noteId) => {
  const titleElement = document.querySelector('#note-title');
  const bodyElement = document.querySelector('#note-body');
  const dateElement = document.querySelector('#last-edited');

  const notes = getNotes();
  const note = notes.find((note) => note.id === noteId);

  if (!note) {
    location.assign('/index.html');
  }

  titleElement.value = note.title;
  bodyElement.value = note.body;
  dateElement.textContent = generateLastEdited(note.updatedAt);
};

export {
  generateNoteDOM, renderNotes, generateLastEdited, initializeEditPage,
};
