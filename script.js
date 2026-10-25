const userProfile = {
  name: "Alex",
  birthYear: 2003,
  isDeveloper: true,
  hobbies: ["Reading", "Design", "Travel"],
};

const currentYear = new Date().getFullYear();
const profileForm = document.querySelector("#profile-form");
const usernameInput = document.querySelector("#username");
const birthYearInput = document.querySelector("#birth-year");
const formMessage = document.querySelector("#form-message");
const ageValue = document.querySelector("#age-value");
const hobbiesCount = document.querySelector("#hobbies-count");
const birthYearValue = document.querySelector("#birth-year-value");
const profileName = document.querySelector("#profile-heading");
const developerStatus = document.querySelector("#developer-status");
const itemForm = document.querySelector("#item-form");
const newItemInput = document.querySelector("#new-item");
const hobbyList = document.querySelector("#hobby-list");
const removeItemButton = document.querySelector("#remove-item");
const listMessage = document.querySelector("#list-message");

function getAge() {
  return currentYear - userProfile.birthYear;
}

function renderHobbies() {
  hobbyList.replaceChildren();

  if (userProfile.hobbies.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-list";
    emptyMessage.textContent = "Your list is empty. Add the first item.";
    hobbyList.append(emptyMessage);
  } else {
    userProfile.hobbies.forEach((hobby) => {
      const item = document.createElement("li");
      item.className = "hobby-item";
      item.textContent = hobby;
      hobbyList.append(item);
    });
  }

  removeItemButton.disabled = userProfile.hobbies.length === 0;
  listMessage.textContent = userProfile.hobbies.length
    ? "You can add another hobby."
    : "Add a hobby to get started.";
}

function renderProfile() {
  profileName.textContent = userProfile.name;
  ageValue.textContent = getAge();
  hobbiesCount.textContent = userProfile.hobbies.length;
  birthYearValue.textContent = userProfile.birthYear;
  developerStatus.textContent = userProfile.isDeveloper ? "Yes" : "No";
  renderHobbies();
}

function logProfile() {
  console.log("User profile:", userProfile);
  console.log(`Age: ${getAge()}; hobbies: ${userProfile.hobbies.length}.`);
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = usernameInput.value.trim();
  const birthYear = Number(birthYearInput.value);
  const isValidYear = Number.isInteger(birthYear) && birthYear >= 1900 && birthYear <= currentYear;

  if (!name || !isValidYear) {
    formMessage.textContent = `Enter a name and a year from 1900 to ${currentYear}.`;
    formMessage.classList.add("is-error");
    return;
  }

  userProfile.name = name;
  userProfile.birthYear = birthYear;
  renderProfile();
  logProfile();
  formMessage.textContent = "Profile updated.";
  formMessage.classList.remove("is-error");
});

itemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const newItem = newItemInput.value.trim();

  if (!newItem) return;

  userProfile.hobbies.push(newItem);
  newItemInput.value = "";
  renderProfile();
  logProfile();
  newItemInput.focus();
});

removeItemButton.addEventListener("click", () => {
  if (userProfile.hobbies.length === 0) return;

  const removedItem = userProfile.hobbies.pop();
  renderProfile();
  logProfile();
  listMessage.textContent = `Removed: ${removedItem}.`;
});

birthYearInput.max = currentYear;
renderProfile();
logProfile();
