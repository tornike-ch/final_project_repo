(() => {
  "use strict";
  const studioEmail = "hello@gancda.com";
  const copy = {
    ka: {
      process: "როგორ ვმუშაობთ",
      steps: [
        ["ვარკვევთ მიზანს", "ერთ ზარზე ვარკვევთ, ვისთვის ვქმნით გამოცდილებას და რა უნდა გააკეთოს ადამიანმა ბოლოს."],
        ["ვწერთ სცენარს", "ვგეგმავთ თითოეულ ნაბიჯს და ვქმნით დიზაინს თქვენი ბრენდის ფერებითა და ხასიათით."],
        ["გაჩვენებთ პირველ ვერსიას", "სცენარის დამტკიცებიდან, როგორც წესი, 48 საათში პირველ ვერსიას საკუთარ ტელეფონზე გამოსცდით. გაშვებამდე ტექსტსა და დეტალებს ერთად ვასწორებთ."],
        ["ვუშვებთ", "გააზიარეთ ბმული, გამოიყენეთ QR კოდი ან გაუგზავნეთ მოწვევა მონაწილეებს Telegram-ში. შედეგებს ანგარიშში ნახავთ."]
      ],
      packages: "ყოველი პროექტი ინდივიდუალურად ფასდება",
      offerLead: "მზა პაკეტები და გამოწერა არ გვაქვს. ფასზე თქვენი მიზნისა და მასშტაბის მიხედვით ვთანხმდებით.",
      offerSteps: ["მოკლე ზარზე ვარკვევთ თქვენს მიზანს, აუდიტორიას და ვადებს.", "შემდეგ გიგზავნით შეთავაზებას ფიქსირებული ფასით.", "გამოწერა და ფარული გადასახადები არ არის."],
      offerCta: "შეთავაზების მოთხოვნა",
      terms: "ყველა გამოცდილება მუშაობს ქართულად და ინგლისურად.",
      heading: "რა გაქვთ ჩაფიქრებული?",
      intro: "ვისთვის ქმნით გამოცდილებას და რისი გაკეთება უნდა შეძლონ მონაწილეებმა? რამდენიმე სიტყვაც საკმარისია.",
      direct: "ან პირდაპირ მოგვწერეთ",
      goal: "თქვენი მიზანი",
      goals: { learn: "სწავლება", onboard: "ადაპტაცია", engage: "კამპანია", attend: "ღონისძიება ან მოსაწვევი", other: "სხვა მიზანი" },
      goalPrompt: "აირჩიეთ მიზანი",
      name: "სახელი", contact: "ტელეფონი ან Telegram", notes: "მოგვიყევით იდეის შესახებ", optional: "არასავალდებულო",
      prepare: "წერილის მომზადება", hint: "აქ მოამზადებთ წერილს და თქვენი ელფოსტიდან გამოგვიგზავნით.",
      readyHeading: "წერილის ტექსტი მზადაა", readyHint: "გახსენით თქვენი საფოსტო აპი და გამოგვიგზავნეთ წერილი. ტექსტის კოპირებაც შეგიძლიათ.",
      openEmail: "ელფოსტის გახსნა", copyBrief: "ტექსტის კოპირება", brief: "წერილის ტექსტი",
      copied: "ტექსტი დაკოპირებულია.", manual: "ტექსტი მონიშნულია. დასაკოპირებლად გამოიყენეთ კოპირების ბრძანება.",
      errReq: "შეავსეთ ეს ველი.", errGoal: "აირჩიეთ მიზანი.", subject: "ახალი პროექტი", greeting: "გამარჯობა, განცდა!"
    },
    en: {
      process: "How we work",
      steps: [
        ["Find the goal", "In one call, we work out who it’s for and what you want them to do by the end."],
        ["Write the experience", "We map each choice, write the script and design the screens in your brand’s style."],
        ["Try a first draft fast", "Usually within 48 hours of signing off the script, you play the first draft on your phone. We refine the words and details with you before launch."],
        ["Launch and learn", "Share a link, display a QR code or send it on Telegram. See how people respond in your report."]
      ],
      packages: "Every project is priced individually",
      offerLead: "We don’t sell packages or subscriptions. We agree on a price based on your goal and scope.",
      offerSteps: ["On a short call we pin down your goal, audience and timing.", "Then we send you a proposal with a fixed price.", "No subscriptions and no hidden fees."],
      offerCta: "Request a proposal",
      terms: "Every experience works in Georgian and English.",
      heading: "What do you have in mind?",
      intro: "Tell us who it’s for and what you’d like them to do. A few lines are plenty.",
      direct: "Or write to us directly",
      goal: "Your goal",
      goals: { learn: "Learning", onboard: "Onboarding", engage: "Campaign", attend: "Event or invitation", other: "Something else" },
      goalPrompt: "Choose a goal",
      name: "Name", contact: "Phone or Telegram", notes: "Tell us about your idea", optional: "optional",
      prepare: "Prepare email", hint: "Prepare your brief here, then send it from your email app.",
      readyHeading: "Your email draft is ready", readyHint: "Open your email app to send it to the studio, or copy the text into a message.",
      openEmail: "Open email app", copyBrief: "Copy brief", brief: "Your brief",
      copied: "Brief copied.", manual: "The brief is selected. Use your device’s copy command to copy it.",
      errReq: "Please fill this in.", errGoal: "Please choose a goal.", subject: "New project", greeting: "Hello gancda,"
    }
  };

  let lang = "ka";
  let selectedGoal = "";
  let draftReady = false;
  const answers = { name: "", contact: "", notes: "" };
  const root = () => document.getElementById("start");
  const direction = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const external = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 19 18 6M6 6h12v12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const symbols = [
    '<path d="M5 5h14v11h-7l-5 4v-4H5z"/>',
    '<path d="M4 19l4-1 11-11a2 2 0 0 0-3-3L5 15zM13 7l3 3"/>',
    '<rect x="6.5" y="2.5" width="11" height="19" rx="2"/><path d="M10.5 5h3M11 18.5h2"/>',
    '<path d="m3 10 18-6-6 17-3.5-7.5L3 10zm8.5 3.5L21 4"/>'
  ];
  const icon = i => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + symbols[i] + '</svg>';

  function snapshot() {
    const form = root()?.querySelector(".gp-form");
    if (!form) return;
    for (const key of Object.keys(answers)) answers[key] = form.elements[key].value;
    selectedGoal = form.elements.goal.value;
  }

  function invalidate(form) {
    snapshot();
    draftReady = false;
    form.querySelector(".gp-draft").hidden = true;
  }

  function renderDraft(form) {
    const t = copy[lang];
    const lines = [t.greeting, "", t.name + " · " + answers.name, t.contact + " · " + answers.contact,
      t.goal + " · " + t.goals[selectedGoal]];
    if (answers.notes.trim()) lines.push("", answers.notes.trim());
    const brief = lines.join("\n");
    form.querySelector(".gp-draft-text").value = brief;
    form.querySelector(".gp-email").href = "mailto:" + studioEmail + "?subject=" + encodeURIComponent(t.subject + " · " + answers.name) + "&body=" + encodeURIComponent(brief);
    form.querySelector(".gp-draft").hidden = false;
  }

  function render() {
    const section = root();
    if (!section) return;
    const t = copy[lang];
    const steps = t.steps.map(([title, body], i) =>
      '<li class="gp-step"><span class="gp-step-icon">' + icon(i) + '</span><h3>' + title + '</h3><p>' + body + '</p></li>').join("");
    const offer = t.offerSteps.map((line, i) => '<li><span>' + (i + 1) + '</span>' + line + '</li>').join("");
    const options = entries => entries.map(([key, label]) => '<option value="' + key + '">' + label + '</option>').join("");
    section.innerHTML = [
      '<div class="wrap gp-process" id="process"><h2 class="gp-title">', t.process, '</h2><ol class="gp-steps">', steps, '</ol></div>',
      '<div class="wrap gp-pricing" id="pricing"><div class="gp-offer"><div class="gp-offer-intro"><span class="gp-offer-mark" aria-hidden="true"><svg><use href="#star"/></svg></span><h2 class="gp-title">', t.packages, '</h2><p>', t.offerLead, '</p></div>',
      '<div class="gp-offer-body"><ol class="gp-offer-steps">', offer, '</ol><a class="gp-button gp-offer-cta" href="#request">', t.offerCta, ' ', direction, '</a><p class="gp-terms">', t.terms, '</p></div></div></div>',
      '<div id="request" class="gp-request"><div class="wrap gp-request-layout"><div class="gp-request-intro"><h2 class="gp-title">', t.heading, '</h2><p>', t.intro,
      '</p><div class="gp-direct"><span>', t.direct, '</span><a href="mailto:', studioEmail, '">', studioEmail, ' ', external, '</a></div></div>',
      '<form class="gp-form" novalidate><div class="gp-fields"><label>', t.goal, '<select name="goal" required><option value="" disabled>', t.goalPrompt, '</option>',
      options(Object.entries(t.goals)), '</select></label>',
      '<label>', t.name, '<input name="name" autocomplete="name" required maxlength="80"></label>',
      '<label>', t.contact, '<input name="contact" required maxlength="120" dir="auto"></label>',
      '<label class="gp-full"><span>', t.notes, ' <small>(', t.optional, ')</small></span><textarea name="notes" rows="3" maxlength="1200"></textarea></label></div>',
      '<div class="gp-submit-row"><button type="submit" class="gp-button">', t.prepare, ' ', direction, '</button><p>', t.hint, '</p></div>',
      '<div class="gp-draft" hidden><h3>', t.readyHeading, '</h3><p>', t.readyHint, '</p><textarea class="gp-draft-text" readonly rows="5" aria-label="', t.brief, '"></textarea>',
      '<div class="gp-draft-actions"><a class="gp-button gp-email" href="mailto:', studioEmail, '">', t.openEmail, ' ', external, '</a><button class="gp-copy" type="button">',
      t.copyBrief, '</button></div><p class="gp-status" role="status"></p></div></form></div></div>'
    ].join("");
    const form = section.querySelector(".gp-form");
    for (const [key, value] of Object.entries(answers)) form.elements[key].value = value;
    form.elements.goal.value = selectedGoal;
    if (draftReady) renderDraft(form);

    form.addEventListener("input", () => invalidate(form));
    form.addEventListener("change", () => invalidate(form));
    form.addEventListener("submit", event => {
      event.preventDefault();
      /* our own messages, in the page language, that stay until the field is fixed */
      form.querySelectorAll(".gp-err").forEach(n => n.remove());
      let first = null;
      for (const key of ["goal", "name", "contact"]) {
        const field = form.elements[key];
        if (key !== "goal") field.value = field.value.trim();
        const ok = !!field.value;
        if (ok) field.removeAttribute("aria-invalid"); else field.setAttribute("aria-invalid", "true");
        if (ok) { field.removeAttribute("aria-describedby"); continue; }
        const msg = document.createElement("p");
        msg.className = "gp-err"; msg.id = "err-" + key; msg.textContent = key === "goal" ? t.errGoal : t.errReq;
        field.insertAdjacentElement("afterend", msg); field.setAttribute("aria-describedby", msg.id);
        if (!first) first = field;
      }
      if (first) { first.focus(); return; }
      snapshot();
      draftReady = true;
      renderDraft(form);
      form.querySelector(".gp-email").focus();
    });
    form.querySelector(".gp-copy").addEventListener("click", async () => {
      const body = form.querySelector(".gp-draft-text");
      const status = form.querySelector(".gp-status");
      try {
        await navigator.clipboard.writeText(body.value);
        status.textContent = copy[lang].copied;
      } catch {
        body.focus();
        body.select();
        status.textContent = copy[lang].manual;
      }
    });
  }

  function onGoal(event) {
    const key = event.detail;
    if (!Object.hasOwn(copy.en.goals, key)) return;
    selectedGoal = key;
    const form = root()?.querySelector(".gp-form");
    if (form && form.elements.goal.value !== key) {
      form.elements.goal.value = key;
      invalidate(form);
    }
  }

  window.GancdaProject = {
    setLanguage(next) {
      if (!Object.hasOwn(copy, next)) return;
      if (next === lang && root()?.querySelector(".gp-form")) return;
      snapshot();
      lang = next;
      render();
    }
  };
  document.addEventListener("gancda:goal", onGoal);
  window.addEventListener("gancda:goal", onGoal);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render, { once: true });
  else render();
})();
