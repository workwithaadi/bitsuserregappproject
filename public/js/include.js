document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('[include-html]').forEach(async function (el) {
        const file = el.getAttribute("include-html");
        const response = await fetch(file);
        if (response.ok) {
            el.innerHTML = await response.text();
        } else {
            el.innerHTML = "Header/Footer not found.";
        }
    });
});
