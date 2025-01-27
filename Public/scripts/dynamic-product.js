document.addEventListener('DOMContentLoaded', async () => {
    const allProductsContainer = document.getElementById('all-products');
    const pageTitle = document.getElementById('page-title');
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category')?.toLowerCase();
    const subcategory = urlParams.get('subcategory')?.toLowerCase();

    // Kategorijų ir subkategorijų struktūra
    const categories = {
        "for-hair": [
            { name: 'shampoos', file: '/Public/src/api/Shampoos.json' },
            { name: 'conditioniers', file: '/Public/src/api/Conditioniers.json' },
            { name: 'masks', file: '/Public/src/api/Masks.json' },
            { name: 'oils-and-serums', file: '/Public/src/api/Oils-and-Serums.json' }
        ],
        "for-face": [
            { name: 'cleaners', file: '/Public/src/api/Cleaners.json' },
            { name: 'tonics', file: '/Public/src/api/Tonics.json' },
            { name: 'creams', file: '/Public/src/api/Creams.json' }
        ]
    };

    // Užkrauti visus produktus, jei nėra kategorijos
    if (!category) {
        pageTitle.textContent = 'ALL PRODUCTS';
        // Užkrauti visus produktus iš visų kategorijų
        for (const categoryFiles of Object.values(categories)) {
            for (const { file } of categoryFiles) {
                await loadProducts(file);
            }
        }
    } else {
        pageTitle.textContent = category.replace(/-/g, ' ').toUpperCase();
        const categoryFiles = categories[category];

        if (subcategory) {
            // Užkrauti konkrečios subkategorijos produktus
            const subcategoryFile = categoryFiles.find(item => item.name === subcategory);
            if (subcategoryFile) {
                await loadProducts(subcategoryFile.file);
            } else {
                console.error('Subcategory not found.');
            }
        } else {
            // Užkrauti visas kategorijos subkategorijas
            for (const { file } of categoryFiles) {
                await loadProducts(file);
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
