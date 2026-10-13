document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) return;
  const subject = encodeURIComponent(`Wanderwise website message from ${name}`);
  const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
  document.getElementById('formFeedback').textContent = 'Opening your email application. Replace the sample recipient address with your own before sending.';
  window.location.href = `mailto:hello@wanderwise.example?subject=${subject}&body=${body}`;
});
