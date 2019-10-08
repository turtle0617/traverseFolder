const folderpicker = document.getElementById("folderpicker");
const filepicker = document.getElementById("filepicker");
const dropArea = document.getElementById("dropArea");
const typeText = document.getElementsByClassName("type__text")[0];
folderpicker.addEventListener(
  "change",
  function(event) {
    const files = event.target.files;
    showDropType("Folder");
    showList(files);
    console.log("folder", files);
  },
  false
);

filepicker.addEventListener(
  "change",
  function(event) {
    const files = event.target.files;
    showDropType("File");
    showList(files);
    console.log("file", files);
  },
  false
);

dropArea.addEventListener("drop", dropHandler);
dropArea.addEventListener("dragover", dragOverHandler);

async function dropHandler(event) {
  event.preventDefault();
  const items = event.dataTransfer.items;
  // Use DataTransferItemList interface to access the file(s)
  const queue = [...items].map((item, index) => {
    if (items[index].kind === "file") {
      const entry = item.webkitGetAsEntry();
      showDropType(entry);
      return entry;
    }
  });
  const fileEntries = await excuteQueue(queue);
  console.log("fileEntries :", fileEntries);
  showListByEntries(fileEntries);
}

function dragOverHandler(event) {
  console.log("File(s) in drop zone");
  event.preventDefault();
}

async function excuteQueue(queue) {
  const fileEntries = [];
  while (queue.length > 0) {
    let entry = queue.shift();
    if (entry.isFile) {
      fileEntries.push(entry);
    } else if (entry.isDirectory) {
      let reader = entry.createReader();
      queue.push(...(await readAllDirectoryEntries(reader)));
    }
  }
  return fileEntries;
}

// Get all the entries (files or sub-directories) in a directory
// by calling readEntries until it returns empty array
async function readAllDirectoryEntries(directoryReader) {
  let entries = [];
  let readEntries = await readEntriesPromise(directoryReader);
  while (readEntries.length > 0) {
    entries.push(...readEntries);
    readEntries = await readEntriesPromise(directoryReader);
  }
  return entries;
}

async function readEntriesPromise(directoryReader) {
  try {
    return await new Promise((resolve, reject) => {
      directoryReader.readEntries(resolve, reject);
    });
  } catch (err) {
    console.log(err);
  }
}

function showDropType(file) {
  if (typeof file === "string") typeText.innerText = file;
  else typeText.innerText = file.isDirectory ? "Folder" : "File";
}

function showList(files) {
  const output = document.getElementById("listing");
  output.innerHTML = "";
  [...files].forEach((file, index) => {
    const item = document.createElement("li");
    const hasPath = files[index].webkitRelativePath;
    item.innerText = hasPath ? files[index].webkitRelativePath : file.name;
    output.appendChild(item);
  });
}

function showListByEntries(fileEntries) {
  const output = document.getElementById("listing");
  output.innerHTML = "";
  fileEntries.forEach(file => {
    const item = document.createElement("li");
    item.innerText = file.fullPath;
    output.appendChild(item);
  });
}
