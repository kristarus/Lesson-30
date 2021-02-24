//===========================DATA==============================

const selectDisplay = document.querySelector("#selectDisplay");
const switchPages = document.querySelector("#switchPages");
let switchbtnId = 1;

//=========================FUNCTIONS===========================

const getUsers = async (pageNumber) => {
  let res = await fetch(`https://reqres.in/api/users?page=1`);
  let data = await res.json();
  const totalUsers = data.total;
  const totalPages = data.total_pages;
  const numOfUsers = getNumUsersPerPage();
  const dataPage = findPage(numOfUsers, pageNumber, totalUsers, totalPages);
  if (dataPage === 2) {
    res = await fetch(`https://reqres.in/api/users?page=2`);
    data = await res.json();
  }
  pageNumber = switchbtnId;
  setPage(data, pageNumber, numOfUsers);
};

const getNumUsersPerPage = () => {
  const indexSelected = selectDisplay.selectedIndex;
  if (indexSelected === 0) {
    return 6;
  } else if (indexSelected === 1) {
    return 3;
  } else if (indexSelected === 2) {
    return 2;
  }
};

const findPage = (numOfUsers, pageNumber, totalUsers, totalPages) => {
  pageNumber = pageNumber > totalUsers / numOfUsers ? 1 : pageNumber;
  switchbtnId = pageNumber;
  if (numOfUsers * pageNumber <= totalUsers / totalPages) {
    return 1;
  } else {
    return 2;
  }
};

const setPage = (data, pageNumber, numOfUsers) => {
  const drawedUsers = [];
  const numOfPages = data.total / numOfUsers;
  let counter =
    data.page === 2
      ? numOfUsers * pageNumber - data.per_page - numOfUsers
      : numOfUsers * pageNumber - numOfUsers;
  let i = 0;
  data.data.forEach((item, index) => {
    if (index >= counter && index < counter + numOfUsers)
      drawedUsers.push(item);
    i++;
  });
  drawPage(drawedUsers, numOfPages);
};

const drawPage = (drawedUsers, numOfPages) => {
  const tableBody = document.querySelector("#tableBody");
  tableBody.innerHTML = "";
  drawedUsers.forEach((item) => {
    tableBody.innerHTML += `
    <div class = "tableBody_user">
      <div class = "tableBody_item">
        <p>${item.first_name}</p>
      </div>
      <div class = "tableBody_item">
        <p>${item.last_name}</p>
      </div>
      <div class = "tableBody_item">
        <p>${item.email}</p>
      </div>
      <div class = "tableBody_item">
        <img src="${item.avatar}">
      </div>
    </div>`;
  });
  drawButtons(numOfPages);
};

const drawButtons = (numOfPages) => {
  switchPages.innerHTML = "";
  for (let i = 1; i <= numOfPages; i++) {
    switchPages.innerHTML += `
    <button switch-id = "${i}" class = "btnSwitch">${i}</button>`;
  }
};

//===========================EVENTS=============================

selectDisplay.addEventListener("click", (event) => {
  getUsers(switchbtnId);
});

switchPages.addEventListener("click", (event) => {
  if (event.target.closest(".btnSwitch")) {
    switchId = event.target.getAttribute("switch-id");
    getUsers(switchId);
    switchbtnId = switchId;
  }
});

//==========================PROGRAM============================

getUsers(switchbtnId);
