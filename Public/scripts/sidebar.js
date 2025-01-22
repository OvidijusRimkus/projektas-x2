const categoriesFile = "/Public/src/api/categories.json"; // Kategorijų JSON failo kelias

// Funkcija įkelti kategorijas
async function loadCategories() {
    const response = await fetch(categoriesFile);
    const categoriesData = await response.json();
    const sidebar = document.getElementById("sidebar-placeholder");

    // Iteracija per kategorijas
    for (const [key, category] of Object.entries(categoriesData)) {
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("category");

        // Subkategorijų produktų kiekio skaičiavimas (asinchroniškai)
        const productCounts = await Promise.all(
            category.products.map(subcategory => countProductsInSubcategory(subcategory.dataFile))
        );
        const totalProducts = productCounts.reduce((total, count) => total + count, 0);

        // Kategorijos pavadinimas su bendru produktų kiekiu
        const categoryTitle = document.createElement("span");
        categoryTitle.textContent = `${category.name} (${totalProducts})`;

        // Rodyklė
        const arrow = document.createElement("span");
        arrow.classList.add("arrow");
        arrow.textContent = "▼";

        // Subkategorijų sąrašas
        const subcategoryList = document.createElement("ul");
        subcategoryList.classList.add("subcategory-list");

        // Iteracija per subkategorijas
        for (let i = 0; i < category.products.length; i++) {
            const subcategory = category.products[i];
            const subcategoryElement = document.createElement("li");
            subcategoryElement.classList.add("subcategory");

            // Subkategorijos pavadinimas su produktų kiekiu
            subcategoryElement.textContent = `${subcategory.name} (${productCounts[i]})`;

            // Pridėti įvykį paspaudus subkategoriją
            subcategoryElement.addEventListener("click", () => {
                window.location.href = subcategory.url;
            });

            subcategoryList.appendChild(subcategoryElement);
        }

        // Pridėti įvykį paspaudus kategoriją
        categoryElement.addEventListener("click", () => {
            const isOpen = categoryElement.classList.toggle("open"); // Atidaro/uždaro kategoriją
            subcategoryList.style.display = isOpen ? "block" : "none";
        });

        // Pridėti kategorijos pavadinimą, rodyklę ir subkategorijų sąrašą
        categoryElement.appendChild(categoryTitle);
        categoryElement.appendChild(arrow);
        sidebar.appendChild(categoryElement);
        sidebar.appendChild(subcategoryList);
    }
}

// Funkcija suskaičiuoti produktus subkategorijos faile
async function countProductsInSubcategory(dataFile) {
    const response = await fetch(dataFile);
    const subcategoryData = await response.json();
    return subcategoryData.products ? subcategoryData.products.length : 0;
}

// Puslapio užkrovimo metu
document.addEventListener("DOMContentLoaded", loadCategories);
