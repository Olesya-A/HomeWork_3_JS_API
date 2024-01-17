const img = document.querySelector(".image");
const author = document.querySelector(".author");
const bio = document.querySelector(".bio");
const insta = document.querySelector(".insta");
const selectImg = document.querySelector(".selectImg");
const currentDate = new Date();
let like = false;

async function fetchPhoto() {
  let page = Math.floor(Math.random() * (100 - 2));
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos?page=${page}&per_page=9&client_id=8IkxnnyMIdUdjjnmggQtdmVXapZkubIUTVNmPO2z2Us`
    );
    const photos = await response.json();
    return photos;
  } catch (error) {
    console.error("Ошибка при загрузке фотографий:", error);
    return [];
  }
}

async function loadPhoto() {
  const responseObj = await fetchPhoto();
  if (responseObj.length === 0) {
    return setTimeout("loadPhoto()", 2000);
  }
  const photo = responseObj[0];
  author.textContent = `Автор: ${photo.user.name}`;
  img.src = photo.urls.small;
  if (photo.user.bio !== null) {
    bio.textContent = `Об авторе: ${photo.user.bio}`;
  }
  if (photo.user.instagram_username !== null) {
    insta.textContent = `Instagram: ${photo.user.instagram_username}`;
  }
  window.localStorage.setItem(
    "foto",
    JSON.stringify({
      day: currentDate.getDate(),
      month: currentDate.getMonth(),
      like: false,
      img: photo.urls.small,
      name: photo.user.name,
      bio: photo.user.bio,
      insta: photo.user.instagram_username,
    })
  );
}

window.addEventListener("load", () => {
  const data = JSON.parse(window.localStorage.getItem("foto"));
  if (
    data.day !== currentDate.getDate() ||
    data.month !== currentDate.getMonth() ||
    data === null
  ) {
    loadPhoto();
  } else {
    author.textContent = `Автор: ${data.name}`;
    img.src = data.img;
    if (data.bio !== null) {
      bio.textContent = `Об авторе: ${data.bio}`;
    }
    if (data.insta !== null) {
      insta.textContent = `Instagram: ${data.insta}`;
    }
    if (data.like) {
      const path = document.getElementsByTagName("path");
      path[0].classList.add("like");
    }
  }
});

selectImg.addEventListener("click", () => {
  const path = document.getElementsByTagName("path");
  const data = JSON.parse(window.localStorage.getItem("foto"));
  if (!document.querySelector(".like")) {
    path[0].classList.add("like");
    data.like = true;
  } else {
    path[0].classList.remove("like");
    data.like = false;
  }
  window.localStorage.setItem("foto", JSON.stringify(data));
});
