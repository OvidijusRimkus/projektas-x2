document.addEventListener('DOMContentLoaded', async () => {
    const allProductsContainer = document.getElementById('all-products');
    const pageTitle = document.getElementById('page-title');
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category')?.toLowerCase();
    const subcategory = urlParams.get('subcategory')?.toLowerCase();

    // Funkcija kategorijoms užkrauti iš JSON failo
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

    // Užkrauti kategorijas iš JSON failo
    const categories = await fetchCategories();
    if (!categories) return;

    // Užkrauti visus produktus, jei nėra kategorijos
    if (!category) {
        pageTitle.textContent = 'ALL PRODUCTS';
        // Užkrauti visus produktus iš visų kategorijų
        for (const categoryKey in categories) {
            const categoryFiles = categories[categoryKey].products;
            for (const { dataFile } of categoryFiles) {
                await loadProducts(dataFile);
            }
        }
    } else {
        pageTitle.textContent = category.replace(/-/g, ' ').toUpperCase();
        const categoryFiles = categories[category].products;

        if (subcategory) {
            // Užkrauti konkrečios subkategorijos produktus
            const subcategoryFile = categoryFiles.find(item => item.id.toLowerCase() === subcategory);
            if (subcategoryFile) {
                await loadProducts(subcategoryFile.dataFile);
            } else {
                console.error('Subcategory not found.');
            }
        } else {
            // Užkrauti visas kategorijos subkategorijas
            for (const { dataFile } of categoryFiles) {
                await loadProducts(dataFile);
            }
        }
    }

    // Funkcija produktams užkrauti
    async function loadProducts(file) {
        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }

            const data = await response.json();
            renderProducts(data.products);
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // Produktų atvaizdavimo funkcija
    function renderProducts(products) {
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product-card');

            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">Price: €${product.price.toFixed(2)}</p>
                <button>Add to Cart</button>
            `;

            allProductsContainer.appendChild(productElement);
        });
    }
});