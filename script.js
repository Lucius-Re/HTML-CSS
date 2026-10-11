"use strict";

function showNotice(form, visible) {
  const notice = form.querySelector(".form-notice");
  if (notice) notice.hidden = !visible;
}

document.querySelectorAll("[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showNotice(form, true);
  });
  form.addEventListener("input", () => showNotice(form, false));
});

document.querySelectorAll("[data-native-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (form.checkValidity()) showNotice(form, true);
  });
  form.addEventListener("input", () => showNotice(form, false));
  form.addEventListener("reset", () => showNotice(form, false));
});

function describeValidity(input) {
  if (input.validity.valueMissing) return input.dataset.requiredMessage || "Please complete this field.";
  if (input.validity.typeMismatch && input.type === "email") return "Enter a valid email address.";
  if (input.validity.tooShort && input.type === "password") return "Password must be at least 8 characters long.";
  if (input.validity.tooShort) return `Enter at least ${input.minLength} characters.`;
  if (input.validity.tooLong) return `Use no more than ${input.maxLength} characters.`;
  if (input.validity.customError) return "Passwords must match.";
  return "Check this field and try again.";
}

function markField(input, showState) {
  if (!showState) {
    input.classList.remove("is-valid", "is-invalid");
    input.removeAttribute("aria-invalid");
    return;
  }
  const valid = input.checkValidity();
  input.classList.toggle("is-valid", valid);
  input.classList.toggle("is-invalid", !valid);
  input.setAttribute("aria-invalid", String(!valid));
  const invalidMessage = input.parentElement.querySelector(".invalid-feedback");
  if (invalidMessage) invalidMessage.textContent = describeValidity(input);
}

function refreshPasswordMatch(password, confirmation, showState) {
  if (confirmation.value && confirmation.value !== password.value) {
    confirmation.setCustomValidity("Passwords must match.");
  } else {
    confirmation.setCustomValidity("");
  }
  markField(confirmation, showState);
}

document.querySelectorAll("[data-feedback-form]").forEach((form) => {
  const fields = Array.from(form.querySelectorAll("input:not([type=radio]):not([type=checkbox]), textarea, select"));
  const confirmation = form.querySelector("#confirm-password");
  const password = form.querySelector("#password");
  let submitted = false;

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      showNotice(form, false);
      const shouldShow = submitted || field.dataset.touched === "true";
      if (field === password && confirmation) refreshPasswordMatch(password, confirmation, shouldShow || confirmation.dataset.touched === "true");
      markField(field, shouldShow);
    });
    field.addEventListener("blur", () => {
      field.dataset.touched = "true";
      if (field === password && confirmation) refreshPasswordMatch(password, confirmation, submitted || confirmation.dataset.touched === "true");
      markField(field, true);
    });
  });

  form.querySelectorAll("input[type=radio][name=gender]").forEach((radio) => {
    radio.addEventListener("change", () => {
      showNotice(form, false);
      if (submitted || radio.closest("fieldset").dataset.touched === "true") updateGenderFeedback(form, true);
    });
    radio.addEventListener("blur", () => {
      radio.closest("fieldset").dataset.touched = "true";
      updateGenderFeedback(form, true);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
    fields.forEach((field) => markField(field, true));
    if (confirmation && password) refreshPasswordMatch(password, confirmation, true);
    updateGenderFeedback(form, true);

    if (!form.checkValidity()) {
      showNotice(form, false);
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    showNotice(form, true);
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      submitted = false;
      fields.forEach((field) => {
        field.dataset.touched = "false";
        markField(field, false);
      });
      const gender = form.querySelector("#gender-group");
      if (gender) {
        gender.dataset.touched = "false";
        gender.classList.remove("is-valid", "is-invalid");
        gender.querySelector(".invalid-feedback").classList.remove("d-block");
        gender.querySelector(".valid-feedback").classList.remove("d-block");
      }
      if (confirmation) confirmation.setCustomValidity("");
      showNotice(form, false);
    }, 0);
  });
});

function updateGenderFeedback(form, showState) {
  const group = form.querySelector("#gender-group");
  if (!group || !showState) return;
  const radios = Array.from(group.querySelectorAll("input[type=radio]"));
  const selected = radios.some((radio) => radio.checked);
  group.classList.toggle("is-valid", selected);
  group.classList.toggle("is-invalid", !selected);
  group.querySelector(".invalid-feedback").classList.toggle("d-block", !selected);
  group.querySelector(".valid-feedback").classList.toggle("d-block", selected);
}
