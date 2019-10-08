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

function dropHandler(event) {
  event.preventDefault();
  const items = event.dataTransfer.items;
  const files = event.dataTransfer.files;
  console.log("items :", items);
  console.log("files :", files);
  if (items) {
    // Use DataTransferItemList interface to access the file(s)
    [...items].forEach((item, index) => {
      if (items[index].kind === "file") {
        const entry = item.webkitGetAsEntry();
        const file = items[index].getAsFile();
        showDropType(entry);
        console.log("... file[" + index + "] = ", file);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...event.dataTransfer.items].forEach((item, index) => {
      console.log(
        "... file[" + index + "] = ",
        event.dataTransfer.files[index]
      );
    });
  }
}

function dragOverHandler(event) {
  console.log("File(s) in drop zone");
  event.preventDefault();
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
