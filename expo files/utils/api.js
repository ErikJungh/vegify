import axios from "axios";

// Create instance called instance
const instance = axios.create({
  baseURL: "http://vegify-2.platform-spanning.systems:5000/",
  headers: {
    "content-type": "application/json",
  },
});

export default {
  postReview: (
    id,
    newPoint ///update_points?id=620f9597b31de512aaa378b7&newPoint=3
  ) =>
    instance({
      method: "POST",
      url: "/recipes/" + id,
      params: {
        point: newPoint,
      },
    }),
  getRecipesBySearch: (searchString, preferences) =>
    instance({
      method: "get",
      url: "/recipes/search/" + searchString,
      params: {
        tags: JSON.stringify(preferences),
      },
      transformResponse: [
        function (data) {
          console.log("DATA", data);
          return JSON.parse(data);
        },
      ],
    }),
  getData: (gtin) =>
    instance({
      method: "GET",
      url: "/product/" + gtin,
      transformResponse: [
        function (data) {
          return JSON.parse(data);
        },
      ],
    }),

  postRecipe: (props) => {
    instance({
      method: "POST",
      url: "/recipes",

      data: props,
    });
  },

  postImage: (data, callback) => {
    instance({
      method: "POST",
      url: "/recipes_image",
      headers: {
        accept: "application/json",
        "Accept-Language": "en-US,en;q=0.8",
        "Content-Type": `multipart/form-data`,
      },
      data: data,

      transformResponse: [
        function (data) {
          console.log("returned data = ******* ", data);
          callback(data);
        },
      ],
    });
  },
  postProduct: (props) => {
    instance({
      method: "POST",
      url: "/product",
      data: {
        GTIN: props.GTIN,
        brand: props.brand,
        ingredients: props.ingredients,
        name: props.name,
        packagesize: props.packagesize,
        image: props.image,

        allergens: props.allergens,
      },
    });
  },
  getDatatext: (prod) =>
    instance({
      method: "GET",
      url: "/product/" + prod,
      transformResponse: [
        function (data) {
          //console.log(data);
          return JSON.parse(data);
        },
      ],
    }),
  getRecipebyId: (recipeId) =>
    instance({
      method: "GET",
      url: "/recipes/" + recipeId,
      transformResponse: [
        function (data) {
          return data; //JSON.parse(data);
        },
      ],
    }),
};
