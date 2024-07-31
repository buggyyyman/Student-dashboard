const cardContainer = document.querySelector(".container");
const addCardButton = document.querySelector(".addcard");
const categoriesList = [
  "Work/Professional",
  "Personal",
  "Home",
  "Finance",
  "Errands",
  "School/Education",
  "Travel",
  "Goals",
  "Miscellaneous",
  "Health and Wellness",
  "Technology",
  "Creative",
];

class TaskManager {
  constructor(cardContainer, addCardButton) {
    this.cards = [];
    this.cardContainer = cardContainer;
    this.addCardButton = addCardButton;
  }

  initialize() {
    this.addCardButton.addEventListener("click", () => this.addCard());
  }

  addCard() {
    const newCard = new Card(Date.now(), []);
    this.cards.push(newCard);
    this.cardContainer.appendChild(newCard.createCardElement());

    newCard.closeButton.addEventListener("click", () =>
      this.handleDelete(newCard.id)
    );
    newCard.addSectionButton.addEventListener("click", () => newCard.addTask());
  }

  handleDelete(id) {
    const cardIndex = this.cards.findIndex((card) => card.id === id);
    if (cardIndex > -1) {
      this.cards[cardIndex].cardElement.remove();
      this.cards.splice(cardIndex, 1);
    }
  }
}

class Card {
  constructor(id, tasks) {
    this.id = id;
    this.tasks = tasks;
    this.cardElement = null;
    this.closeButton = null;
    this.addSectionButton = null;
  }

  createCardElement() {
    this.cardElement = document.createElement("div");
    this.closeButton = document.createElement("button");
    this.addSectionButton = document.createElement("button");

    this.cardElement.classList.add("card");
    this.cardElement.setAttribute("id", `${this.id}`);

    this.closeButton.classList.add("close-btn");
    this.closeButton.innerHTML = "close";
    this.addSectionButton.innerHTML = "add section";

    this.cardElement.append(this.closeButton, this.addSectionButton);
    return this.cardElement;
  }

  addTask() {
    const newTask = new Task(Date.now(), "", false, []);
    this.tasks.push(newTask);
    const newTaskElement = newTask.createTaskElement();
    this.cardElement.appendChild(newTaskElement);

    newTask.deleteButton.addEventListener("click", () =>
      this.handleDelete(newTask.id)
    );
    newTask.doneButton.addEventListener("click", () => newTask.toggleDone());
    newTask.editButton.addEventListener("click", () => newTask.openModal());
  }

  handleDelete(id) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex].taskElement.remove();
      this.tasks.splice(taskIndex, 1);
    }
  }
}

class Task {
  constructor(id, title, status, subtasks) {
    this.id = id;
    this.title = title;
    this.status = status;
    this.subtasks = subtasks;
    this.taskElement = null;
    this.doneButton = null;
    this.deleteButton = null;
    this.editButton = null;
    this.taskInput = null;
  }

  createTaskElement() {
    this.taskElement = document.createElement("div");
    this.doneButton = document.createElement("input");
    this.deleteButton = document.createElement("button");
    this.editButton = document.createElement("button");
    this.taskInput = document.createElement("input");

    this.taskElement.classList.add("section");
    this.taskElement.setAttribute("id", `${this.id}`);

    this.doneButton.setAttribute("type", "checkbox");
    this.deleteButton.innerHTML = "delete";
    this.editButton.innerHTML = "edit";
    this.taskInput.setAttribute("type", "text");
    this.taskInput.value = this.title;

    this.doneButton.classList.add("btn-done");

    this.taskElement.append(
      this.doneButton,
      this.taskInput,
      this.deleteButton,
      this.editButton
    );
    return this.taskElement;
  }

  toggleDone() {
    this.taskElement.style.backgroundColor = this.doneButton.checked
      ? "green"
      : "rgb(136, 94, 94)";
  }

  openModal() {
    const modal = new Modal();
    modal.createModal();
    modal.contentElement.appendChild(
      this.createModalContent(modal.closeButton)
    );
  }

  createModalContent(closeButton) {
    const content = document.createElement("div");
    const taskTitle = document.createElement("input");
    const subTasks = document.createElement("div");
    const addSubtasks = document.createElement("button");
    const submitButton = document.createElement("button");

    taskTitle.value = this.title;
    subTasks.classList.add("subTask-container");
    addSubtasks.innerHTML = "add";
    submitButton.innerHTML = "submit";

    addSubtasks.addEventListener("click", () =>
      this.addSubtask(subTasks, submitButton)
    );

    content.append(taskTitle, subTasks, addSubtasks, submitButton);
    closeButton.addEventListener("click", () => content.remove());
    return content;
  }

  addSubtask(subTasks, submitButton) {
    const subTask = new Subtask(Date.now(), "");
    this.subtasks.push(subTask);
    subTasks.appendChild(subTask.createSubtaskElement());

    submitButton.addEventListener("click", () =>
      console.log(subTask.taskInput.value)
    );
  }
}

class Subtask extends Task {
  constructor(id, title) {
    super(id, title, false, []);
  }

  createSubtaskElement() {
    const subTaskElement = document.createElement("div");
    const doneButton = document.createElement("input");
    const deleteButton = document.createElement("button");
    const editButton = document.createElement("button");
    const taskInput = document.createElement("input");
    const categories = document.createElement("select");

    categoriesList.forEach((cat) => {
      const category = document.createElement("option");
      category.innerHTML = cat;
      categories.appendChild(category);
    });

    subTaskElement.classList.add("subTask");
    subTaskElement.setAttribute("id", `${this.id}`);

    doneButton.setAttribute("type", "checkbox");
    deleteButton.innerHTML = "delete";
    editButton.innerHTML = "edit";
    taskInput.setAttribute("type", "text");
    taskInput.value = this.title;

    doneButton.classList.add("btn-done");

    subTaskElement.append(
      doneButton,
      taskInput,
      deleteButton,
      editButton,
      categories
    );

    deleteButton.addEventListener("click", () => subTaskElement.remove());
    return subTaskElement;
  }
}

class Modal {
  constructor() {
    this.modalElement = null;
    this.contentElement = null;
    this.closeButton = null;
  }

  createModal() {
    this.modalElement = document.createElement("div");
    this.contentElement = document.createElement("div");
    this.closeButton = document.createElement("button");

    this.modalElement.classList.add("modal");
    this.contentElement.classList.add("content");
    this.closeButton.innerHTML = "close";
    this.closeButton.addEventListener("click", () => this.closeModal());

    this.modalElement.appendChild(this.contentElement);
    document.body.append(this.modalElement);
    this.contentElement.appendChild(this.closeButton);

    this.modalElement.addEventListener("click", (evt) => {
      if (evt.target.className === "modal") {
        this.closeModal();
      }
    });
  }

  closeModal() {
    if (this.modalElement) {
      this.modalElement.remove();
    }
  }
}

// Initialize the task manager
const taskManager = new TaskManager(cardContainer, addCardButton);
taskManager.initialize();
