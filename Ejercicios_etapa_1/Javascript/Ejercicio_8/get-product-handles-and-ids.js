// importa getproductHandles y getproductIds de el archivo de utils
import {getproductHandles, getproductIds } from "/home/bambiux/code/Bambi-uxx/orion-bootcamp-v3/Ejercicios_etapa_1/Javascript/Ejercicio_8/utils/utils.js";

const getProductHandlesAndIds = products => {
    const handles = getproductHandles(products);
    const ids = getproductIds(products);

    return products.map((product, index) => ({
        id: ids[index],
        handle: handles[index]
    }));
}

// exporta getProductHandlesAndIds
export default getProductHandlesAndIds
