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

// Puslapio konteksto atnaujinimas
function updatePageContext(categories, categoryId, productId = null) {
    const mainContent = document.querySelector('#main-content');
    const breadcrumbNav = document.querySelector('.breadcrumb');
    breadcrumbNav.innerHTML = ''; // Išvalyti navigaciją

    // Pridėti pagrindinį puslapį (Home)
    breadcrumbNav.innerHTML += `<li><a href="/index.html">Home</a></li>`;

    // Rasti kategoriją
    if (categoryId && categories[categoryId]) {
        const category = categories[categoryId];
        mainContent.setAttribute('data-category', category.id);
        breadcrumbNav.innerHTML += `<li><a href="${category.url}">${category.name}</a></li>`;

        // Rasti produktą
        if (productId) {
            const product = category.products.find(p => p.id === productId);
            if (product) {
                mainContent.setAttribute('data-page', product.id);
                breadcrumbNav.innerHTML += `<li><a href="${product.url}">${product.name}</a></li>`;
            }
        }
    }
}

// Dabartinio URL analizė
function getCurrentContext() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category'); // Pvz., ?category=for-hair
    const productId = urlParams.get('product');  // Pvz., ?product=Shampoos
    return { categoryId, productId };
}

// Inicializacija
document.addEventListener('DOMContentLoaded', async () => {
    // Gauti kategorijas iš JSON failo
    const categories = await fetchCategories();
    if (!categories) return;

    // Gauti dabartinį kontekstą
    const { categoryId, productId } = getCurrentContext();

    // Atnaujinti puslapio kontekstą
    updatePageContext(categories, categoryId, productId);
});


 // JSON produktų užkrovimo logika
 document.addEventListener('DOMContentLoaded', () => {
    const allProductsContainer = document.getElementById('all-products');

    const categories = [
        '/Public/src/api/Shampoos.json',
        '/Public/src/api/Conditioniers.json',
        '/Public/src/api/Masks.json',
        '/Public/src/api/Oils-and-Serums.json',
        '/Public/src/api/Cleaners.json',
        '/Public/src/api/Tonics.json',
        '/Public/src/api/Creams.json'
    ];

    categories.forEach(category => {
        fetch(category)
            .then(response => response.json())
            .then(data => {
                data.products.forEach(product => {
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
            })
            .catch(error => console.error('Error loading products:', error));
    });
});