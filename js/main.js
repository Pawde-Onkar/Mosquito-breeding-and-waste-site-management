// JS placeholder
console.log("Website loaded successfully.");

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  // Report form toast message
  const reportForm = document.getElementById("reportForm");
  if (reportForm) {
    reportForm.addEventListener("submit", function (e) {
      e.preventDefault();
      showToast("Report submitted successfully!");
      this.reset();
    });
  }

  // Counter animation when in view
  const counters = document.querySelectorAll(".counter");
  const speed = 100;

  const animateCounters = () => {
    counters.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-target");
        const count = +counter.innerText;
        const increment = Math.ceil(target / speed);

        if (count < target) {
          counter.innerText = Math.min(target, count + increment);
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target;
        }
      };

      updateCount();
    });
  };

  // Trigger animation only when counter section is visible
  const counterSection = document.querySelector(".counters-section");
  if (counterSection) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect(); // run only once
        }
      });
    }, { threshold: 0.5 });

    observer.observe(counterSection);
  }
});
window.addEventListener('load', () => {
  showToast("Welcome! Start by reporting an issue or checking stats.");
});
document.addEventListener("DOMContentLoaded", function () {
  const textArray = [
    "Join the Fight Against Waste",
    "Protect Your Community from Mosquitoes",
    "Make Your City Cleaner and Safer"
  ];

  const typingSpeed = 80;
  const erasingSpeed = 50;
  const delayBetween = 2000;

  let currentTextIndex = 0;
  let charIndex = 0;
  let typing = true;

  const typedTextElement = document.getElementById("typed-text");

  function type() {
    if (typing) {
      if (charIndex < textArray[currentTextIndex].length) {
        typedTextElement.textContent += textArray[currentTextIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
      } else {
        typing = false;
        setTimeout(type, delayBetween);
      }
    } else {
      if (charIndex > 0) {
        typedTextElement.textContent = textArray[currentTextIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(type, erasingSpeed);
      } else {
        typing = true;
        currentTextIndex = (currentTextIndex + 1) % textArray.length;
        setTimeout(type, typingSpeed);
      }
    }
  }

  type();
});
