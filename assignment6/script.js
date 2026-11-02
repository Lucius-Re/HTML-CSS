"use strict";

$(document).ready(function () {
  console.log("jQuery is ready!");

  // Task 1: a tag selector, an ID selector, and a class selector.
  $("h1").css("letter-spacing", "-0.065em");
  $("#greeting").text("A little space to learn and make.");
  $(".profile-intro").css({
    "border-left": "2px solid #d96b50",
    "padding-left": "1rem"
  });

  const headlines = [
    "Front-end in progress",
    "Curious by design",
    "Learning through making"
  ];
  let headlineIndex = 0;

  $("#headline-button").on("click", function () {
    headlineIndex = (headlineIndex + 1) % headlines.length;
    $("#profile-headline").html(`${headlines[headlineIndex]} <span aria-hidden="true">↗</span>`);
  });

  $("#light-theme").on("click", function () {
    $("body").removeClass("theme-dark");
    $(".theme-button").removeClass("is-active");
    $(this).addClass("is-active");
    $(".profile-intro").css("border-left-color", "#d96b50");
  });

  $("#dark-theme").on("click", function () {
    $("body").addClass("theme-dark");
    $(".theme-button").removeClass("is-active");
    $(this).addClass("is-active");
    $(".profile-intro").css("border-left-color", "#b5a2e8");
  });

  // Task 2: .hide(), .show(), and .toggle() control the same content.
  const aboutDetails = $(".visibility-content");
  $("#hide-about").on("click", function () {
    aboutDetails.stop(true, true).hide(220);
  });
  $("#show-about").on("click", function () {
    aboutDetails.stop(true, true).show(220);
  });
  $("#toggle-about").on("click", function () {
    aboutDetails.stop(true, true).toggle(220);
  });

  // Task 3: fade methods act on the local SVG gallery images.
  $("#fade-out-first").on("click", function () {
    $("#gallery-first").stop(true, true).fadeOut(420);
  });
  $("#fade-in-first").on("click", function () {
    $("#gallery-first").stop(true, true).fadeIn(420);
  });
  $("#fade-toggle-second").on("click", function () {
    $("#gallery-second").stop(true, true).fadeToggle(420);
  });

  // Task 4: each heading uses .slideToggle(); these controls show both other methods.
  $(".favorite-trigger").on("click", function () {
    const trigger = $(this);
    const panel = $(`#${trigger.attr("data-panel")}`);
    const expanded = trigger.attr("aria-expanded") === "true";
    trigger.attr("aria-expanded", String(!expanded));
    trigger.find(".trigger-mark").text(expanded ? "+" : "−");
    panel.stop(true, true).slideToggle(320);
  });

  $("#open-favorites").on("click", function () {
    $(".favorite-trigger").attr("aria-expanded", "true").find(".trigger-mark").text("−");
    $(".favorite-panel").stop(true, true).slideDown(320);
  });

  $("#close-favorites").on("click", function () {
    $(".favorite-trigger").attr("aria-expanded", "false").find(".trigger-mark").text("+");
    $(".favorite-panel").stop(true, true).slideUp(320);
  });

  // Task 5: append, prepend, and remove list items without accepting empty input.
  const skillList = $("#skill-list");
  const skillInput = $("#new-skill");
  const skillFeedback = $("#skill-feedback");

  function updateSkillCount() {
    const items = skillList.children("li");
    $("#skill-count").text(String(items.length).padStart(2, "0"));
    items.each(function (index) {
      $(this).find(".skill-bullet").text(String(index + 1).padStart(2, "0"));
    });
  }

  function makeSkillItem(name) {
    const item = $("<li>");
    $("<span>", { class: "skill-bullet", text: "" }).appendTo(item);
    $("<span>", { class: "skill-name", text: name }).appendTo(item);
    $("<span>", { class: "skill-tag", text: "new" }).appendTo(item);
    return item;
  }

  function takeSkillInput() {
    const value = skillInput.val().trim();
    if (!value) {
      skillFeedback.text("Add a skill name first.").addClass("is-error");
      skillInput.trigger("focus");
      return "";
    }
    skillFeedback.removeClass("is-error");
    skillInput.val("");
    return value;
  }

  $("#add-skill").on("click", function () {
    const value = takeSkillInput();
    if (!value) return;
    skillList.append(makeSkillItem(value));
    updateSkillCount();
    skillFeedback.text(`Added “${value}” to the end of the list.`);
  });

  $("#prepend-skill").on("click", function () {
    const value = takeSkillInput();
    if (!value) return;
    skillList.prepend(makeSkillItem(value));
    updateSkillCount();
    skillFeedback.text(`Added “${value}” to the start of the list.`);
  });

  skillInput.on("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      $("#add-skill").trigger("click");
    }
  });

  $("#remove-skill").on("click", function () {
    const lastSkill = skillList.children("li:last-child");
    if (!lastSkill.length) {
      skillFeedback.text("The list is empty. Add a skill to start again.").addClass("is-error");
      return;
    }
    const removedName = lastSkill.find(".skill-name").text() || lastSkill.children("span").eq(1).text();
    lastSkill.remove();
    updateSkillCount();
    skillFeedback.removeClass("is-error").text(`Removed “${removedName}” from the list.`);
  });

  // Task 6: .attr() changes the destination and accessible text of the social link.
  const socialLink = $("#social-link");
  let showingProject = true;
  $("#change-link").on("click", function () {
    showingProject = !showingProject;
    if (showingProject) {
      socialLink.attr("href", "https://github.com/Lucius-Re/HTML-CSS/tree/assignment6-jquery").text("GitHub project ");
      $("#link-status").text("PROJECT");
    } else {
      socialLink.attr("href", "https://github.com/Lucius-Re").text("GitHub profile ");
      $("#link-status").text("PROFILE");
    }
    socialLink.append("<span aria-hidden=\"true\">↗</span>");
  });

  // Task 7: .val() reads the form; .text() writes a safe live preview.
  function updateLivePreview() {
    const name = $("#visitor-name").val().trim();
    const email = $("#visitor-email").val().trim();
    if (!name && !email) {
      $("#live-preview").text("Your message will appear here as you type.");
      return;
    }
    const parts = [];
    if (name) parts.push(`Hello, I’m ${name}.`);
    if (email) parts.push(`You can reach me at ${email}.`);
    $("#live-preview").text(parts.join(" "));
  }

  $("#live-form").on("input", "input", updateLivePreview);

  // Task 8: .animate() moves each bar to its own target and back to zero.
  let skillsAreAnimated = false;
  $("#animate-skills").on("click", function () {
    const rows = $(".progress-row");
    skillsAreAnimated = !skillsAreAnimated;
    rows.each(function () {
      const row = $(this);
      const fill = row.find(".progress-fill");
      const value = row.find(".progress-value");
      const target = skillsAreAnimated ? Number(row.attr("data-skill-level")) : 0;
      fill.stop(true, true).animate({ width: `${target}%` }, 900, "swing", function () {
        value.text(`${target}%`);
        row.attr("aria-valuenow", String(target));
      });
    });
    $("#animate-skills").html(skillsAreAnimated ? "Reset my skills <span aria-hidden=\"true\">↘</span>" : "Animate my skills <span aria-hidden=\"true\">↗</span>");
    $("#animation-note").text(skillsAreAnimated ? "Different target widths show different example levels." : "Back to zero, ready for another try.");
  });
});
