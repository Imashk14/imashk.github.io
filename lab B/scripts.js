class ToDo {
  constructor() {
    this.storageKey = "todo.tasks";
    this.tasks = this.loadTasks();
    this.editingTaskId = null;
    this.editingField = null;
    this.editValue = "";

    this.listEl = document.querySelector("#tasks");
    this.searchEl = document.querySelector("#search");
    this.taskInputEl = document.querySelector("#taskInput");
    this.dateInputEl = document.querySelector("#dateInput");
    this.addBtnEl = document.querySelector("#addBtn");

    this.addBtnEl.addEventListener('click', () => {this.handleAdd()});

    const handleAddOnEnter = (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      this.handleAdd();
    };

    this.taskInputEl.addEventListener("keydown", handleAddOnEnter);
    this.dateInputEl.addEventListener("keydown", handleAddOnEnter);

    this.searchEl.addEventListener('input', () => {this.draw()});
  }

  handleAdd() {
    const name = this.taskInputEl.value.trim();
    const date = this.dateInputEl.value;

    if (!name) return;

    this.addTask({
      id: crypto.randomUUID(),
      name,
      date,
      done: false
    })

    this.taskInputEl.value = "";
    this.dateInputEl.value = "";
    this.draw();
  }

  addTask(task) {
    this.tasks.push(task);
    this.saveTasks();
  }

  loadTasks() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed;
    } catch {
      return [];
    }
  }

  saveTasks() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
  }

  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  buildHighlight(text, query) {
    const fragment = document.createDocumentFragment();

    if (!query) {
      fragment.append(document.createTextNode(text));
      return fragment;
    }

    const regex = new RegExp(`(${this.escapeRegex(query)})`, 'ig');
    const parts = text.split(regex);

    parts.forEach((part) => {
      if (!part) return;
      if (part.toLowerCase() === query.toLowerCase()) {
        const mark = document.createElement('mark');
        mark.textContent = part;
        fragment.append(mark);
      } else {
        fragment.append(document.createTextNode(part));
      }
      }
    );

    return fragment;
  }

  startEdit(task, field) {
    this.editingTaskId = task.id;
    this.editingField = field;
    this.editValue = field === "date" ? (task.date || "") : task.name;
    this.draw();
  }

  cancelEdit() {
    this.editingTaskId = null;
    this.editingField = null;
    this.editValue = "";
    this.draw();
  }

  commitEdit(task) {
    if (this.editingTaskId !== task.id) return;

    if (this.editingField === "name") {
      const trimmedName = this.editValue.trim();
      if (!trimmedName) {
        this.cancelEdit();
        return;
      }
      task.name = trimmedName;
      this.saveTasks();
    }

    if (this.editingField === "date") {
      this.editValue = this.editValue.trim();
      if (this.editValue && !/^\d{4}-\d{2}-\d{2}$/.test(this.editValue)) {
        this.cancelEdit();
        return;
      }
      task.date = this.editValue;
      this.saveTasks();
    }

    this.editingTaskId = null;
    this.editingField = null;
    this.editValue = "";
    this.draw();
  }

  renderEditableCell(task, field, query) {
    const isEditing = this.editingTaskId === task.id && this.editingField === field;

    if (!isEditing) {
      const el = field === "name" ? document.createElement("label") : document.createElement("span");
      el.className = "editable";

      if (field === "name") {
        el.append(this.buildHighlight(task.name, query));
        el.title = "Click to edit task name";
      } else {
        el.textContent = task.date || "No date";
        el.title = "Click to edit date";
      }

      el.addEventListener("click", () => this.startEdit(task, field));
      return el;
    }

    const input = document.createElement("input");
    input.type = field === "date" ? "date" : "text";
    input.value = this.editValue;
    input.className = "inlineEditor";

    input.addEventListener("input", () => {
      this.editValue = input.value;
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.commitEdit(task);
      if (e.key === "Escape") this.cancelEdit();
    });

    input.addEventListener("blur", () => this.commitEdit(task));

    queueMicrotask(() => {
      input.focus();
      if (input.type === "text") input.select();
    });

    return input;
  }

  draw() {
    const query = this.searchEl.value.trim().toLowerCase();
    const visible = this.tasks.filter(t => t.name.toLowerCase().includes(query));

    this.listEl.replaceChildren();

    visible.forEach((task) => {
      const row = document.createElement("div");
      row.className = task.done ? "task done" : "task";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;

      const label = this.renderEditableCell(task, "name", query);
      const date = this.renderEditableCell(task, "date", query);

      const del = document.createElement("button");
      del.textContent = "Delete";
      del.addEventListener("click", () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.saveTasks();

        if (this.editingTaskId === task.id) {
          this.editingTaskId = null;
          this.editingField = null;
          this.editValue = "";
        }

        this.draw();
      });

      checkbox.addEventListener("change", () => {
        task.done = checkbox.checked;
        this.saveTasks();
        this.draw();
      });

      row.append(checkbox, label, date, del);
      this.listEl.appendChild(row);
    });
  }
}

let todo = new ToDo();
todo.draw();
