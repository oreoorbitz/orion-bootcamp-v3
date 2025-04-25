// importa getproductHandles y getproductIds de el archivo de utils


const getProductHandlesAndIds = products => {
    const handles = getproductHandles(products);
    const ids = getproductIds(products);

    return products.map((product, index) => ({
        id: ids[index],
        handle: handles[index]
    }));
}

// exporta getProductHandlesAndIds