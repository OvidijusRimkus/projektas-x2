// Funkcija duomenims gauti iš JSON failo
async function fetchCategories() {
    try {
        const response = await fetch('/Public/src/api/categories.json');
        if (!response.ok) throw new Error('Nepavyko įkelti kategorijų.');
        return await response.json();
    } catch (error) {
        console.error('Klaida įkeliant kategorijas:', error);
        return null;
    }
}

// Puslapio konteksto atnaujinimas su dinamišku „/“
function updatePageContext(categories, categoryId, subcategoryId = null) {
    const mainContent = document.querySelector('#main-content');
    const breadcrumbNav = document.querySelector('.breadcrumb');
    breadcrumbNav.innerHTML = ''; // Išvalyti navigaciją

    // Pridėti pagrindinį puslapį (Home)
    breadcrumbNav.innerHTML += `<li><a href="/Public/index.html">Home</a></li>`;

    if (!mainContent) {
        console.error('Element with ID "main-content" not found.');
        return;
    }

    // Rasti kategoriją
    if (categoryId && categories[categoryId]) {
        const category = categories[categoryId];
        mainContent.setAttribute('data-category', category.id);

        breadcrumbNav.innerHTML += `<li><a href="/Public/pages/products.html?category=${category.id}">${category.name}</a></li>`;

        // Rasti subkategoriją
        if (subcategoryId) {
            const subcategory = category.products.find(
                (p) => p.id.toLowerCase() === subcategoryId
            );

            if (subcategory) {
                mainContent.setAttribute('data-page', subcategory.id);

                breadcrumbNav.innerHTML += `<li><a href="/Public/pages/products.html?category=${category.id}&subcategory=${subcategory.id}">${subcategory.name}</a></li>`;
            } else {
                console.error(`Subcategory with ID "${subcategoryId}" not found.`);
            }
        }
    } else {
        console.error(`Category with ID "${categoryId}" not found.`);
    }

    // Pridėti CSS klasę „breadcrumb-item“ kiekvienam elementui
    const breadcrumbItems = breadcrumbNav.querySelectorAll('li');
    breadcrumbItems.forEach((item, index) => {
        if (index !== breadcrumbItems.length - 1) {
            item.classList.add('breadcrumb-item');
        }
    });
}

// Dabartinio URL analizė
function getCurrentContext() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category')?.toLowerCase();
    const subcategoryId = urlParams.get('subcategory')?.toLowerCase();

    console.log('Category ID:', categoryId);
    console.log('Subcategory ID:', subcategoryId);

    const breadcrumbContainer = document.querySelector(".breadcrumb-navigation");
    if (breadcrumbContainer) {
        breadcrumbContainer.dataset.category = categoryId || '';
        breadcrumbContainer.dataset.page = subcategoryId || '';
    }

    return { categoryId, subcategoryId };
}

// Inicializacija
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const categories = await fetchCategories();
        if (!categories) throw new Error('Kategorijų duomenys yra tušti arba nepavyko jų įkelti.');

        const { categoryId, subcategoryId } = getCurrentContext();

        // Visada pridėti "Home" į breadcrumb navigaciją
        const breadcrumbNav = document.querySelector('.breadcrumb');
        breadcrumbNav.innerHTML = `<li><a href="/Public/index.html">Home</a></li>`;

        // Patikrinkite, ar yra nurodyta kategorija
        if (categoryId) {
            updatePageContext(categories, categoryId, subcategoryId);
        } else {
            console.log('Esate pagrindiniame puslapyje.');
        }
    } catch (error) {
        console.error('Klaida inicializuojant puslapį:', error);
    }
});