/**
 * Gerenciador de Formulários (Feedback e Newsletters)
 * Validação, acessibilidade com ARIA Live Regions e tratamento de erros.
 */

export const FORM_MESSAGES = {
  sending: "Enviando…",
  demoMode:
    "Formulário preparado. Configure o endpoint real nas variáveis de ambiente.",
  feedbackSuccess: "Obrigado pelo feedback!",
  newsletterSuccess: "Cadastro realizado! Confira seu e-mail.",
  error: "Não foi possível enviar agora. Tente novamente mais tarde.",
} as const;

export function initFeedbackForm(): void {
  const formElement = document.querySelector("[data-feedback-form]");
  if (!(formElement instanceof HTMLFormElement)) return;

  const statusElement = formElement.querySelector("[data-feedback-status]");

  formElement.addEventListener("submit", async (event: SubmitEvent) => {
    event.preventDefault();
    const endpoint = formElement.dataset.endpoint;

    if (!endpoint) {
      if (statusElement) statusElement.textContent = FORM_MESSAGES.demoMode;
      return;
    }

    if (statusElement) statusElement.textContent = FORM_MESSAGES.sending;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(
          Object.fromEntries(new FormData(formElement).entries()),
        ),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Falha no envio");

      if (statusElement)
        statusElement.textContent = FORM_MESSAGES.feedbackSuccess;
      formElement.reset();
      window.dejotacodeTrack?.("feedback_submitted", {
        source: "feedback-page",
      });
    } catch {
      if (statusElement) statusElement.textContent = FORM_MESSAGES.error;
    }
  });
}

export function initSegmentedNewsletters(): void {
  const forms = document.querySelectorAll("[data-segmented-form]");

  forms.forEach((form) => {
    if (!(form instanceof HTMLFormElement) || form.dataset.bound === "true")
      return;
    form.dataset.bound = "true";

    form.addEventListener("submit", async (event: SubmitEvent) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const endpoint = form.dataset.endpoint;
      const statusElement = form.querySelector("[data-form-status]");
      const segmentInput =
        form.querySelector<HTMLInputElement>("[name=segment]");
      const segment = form.dataset.segment || segmentInput?.value || "geral";
      const submitButton = form.querySelector<HTMLButtonElement>(
        "button[type=submit]",
      );

      if (!endpoint) {
        if (statusElement) statusElement.textContent = FORM_MESSAGES.demoMode;
        window.dejotacodeTrack?.("newsletter_submit", { segment, demo: true });
        return;
      }

      if (submitButton) submitButton.disabled = true;
      if (statusElement) statusElement.textContent = FORM_MESSAGES.sending;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: JSON.stringify({
            email: new FormData(form).get("email"),
            source: new FormData(form).get("source"),
            consent: true,
            interests: [segment],
          }),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Falha na assinatura");

        form.reset();
        if (statusElement)
          statusElement.textContent = FORM_MESSAGES.newsletterSuccess;
        window.dejotacodeTrack?.("newsletter_submit", { segment });
      } catch {
        if (statusElement) statusElement.textContent = FORM_MESSAGES.error;
        window.dejotacodeTrack?.("newsletter_error", { segment });
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  });
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    initFeedbackForm();
    initSegmentedNewsletters();
  });
}
