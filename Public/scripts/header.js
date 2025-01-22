async function loadComponent(placeholderId, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        const data = await response.text();
        document.getElementById(placeholderId).innerHTML = data;
    } catch (error) {
        console.error(`Error loading component: ${error}`);
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    // Įkeliame header dinamiškai
    await loadComponent('header-placeholder', '/Public/components/header.html');

    // Po įkėlimo inicializuojame dropdown meniu logiką
    const productsDropdown = document.querySelector(".dropdown-menu");

    try {
        const response = await fetch("/Public/src/api/categories.json");
        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        const categoriesData = await response.json();

        Object.values(categoriesData).forEach(category => {
            const categoryItem = document.createElement("li");
            categoryItem.classList.add("dropdown-category");
            categoryItem.innerHTML = `
                <a href="${category.url}">${category.name}</a>
                <ul class="subcategory-menu">
                    ${category.products.map(sub => `<li><a href="${sub.url}">${sub.name}</a></li>`).join("")}
                </ul>
            `;

            productsDropdown.appendChild(categoryItem);
        });
    } catch (error) {
        console.error("Error loading categories and subcategories:", error);
    }
});