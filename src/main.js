import {render, RenderPosition} from "./utils.js";
import UserProfileView from "./view/user-profile-view.js";
import MenuView from "./view/menu-view.js";
import SortingView from "./view/sorting-view.js";
import FilmSectionView from "./view/film-section-view.js";
import FilmsListView from "./view/film-list-view.js";
import ShowMoreButtonView from "./view/show-more-button-view.js";
import FilmCardView from "./view/film-card-view.js";
import TotalMovieView from "./view/total-movie-view.js";
import PopupView from "./view/popup-view.js";
import FilmsListContainerView from "./view/film-list-container-view.js";
import NoFilmsMessageView from "./view/no-films-message-view.js";
import {
  generateComments,
  films,
  topFilms,
  commentedFilms,
  FILMS_COUNT,
  MAX_FILMS_COUNT
} from "./mock/data.js";
import {generateFilterData} from "./mock/filter.js";

const filterData = generateFilterData(films);

const renderFilm = (container, position, film) =>
  render(
      container,
      RenderPosition[position],
      new FilmCardView(film).getElement()
  );

const pageHeaderElement = document.querySelector(`.header`);
const pageBodyElement = document.querySelector(`body`);
const pageMainElement = document.querySelector(`.main`);
const pageFooterElement = document.querySelector(`.footer`);
const footerStatsElement = pageFooterElement.querySelector(
    `.footer__statistics`
);

const filmSectionElement = new FilmSectionView().getElement();
const showMoreFilmsBtnElement = new ShowMoreButtonView().getElement();
const filmsListElement = new FilmsListView(`main`).getElement();
const filmsListContainerElement = new FilmsListContainerView().getElement();
const mostCommentedListElement = new FilmsListView(`commented`).getElement();
const topRatedListElement = new FilmsListView(`rated`).getElement();
const mostCommentedContainerElement = new FilmsListContainerView().getElement();
const topRatedContainerElement = new FilmsListContainerView().getElement();

const findFilm = (filmsArray, filmId) => {
  return filmsArray.find((film) => {
    return film.id === filmId;
  });
};

const addListenerToFilmsList = (container, filmsList) => {
  container.addEventListener(`click`, (evt) => {
    let target = evt.target;
    if (
      target.classList.contains(`film-card__poster`) ||
      target.classList.contains(`film-card__title`) ||
      target.classList.contains(`film-card__comments`)
    ) {
      const activeFilm = findFilm(filmsList, target.parentElement.dataset.id);

      renderPopup(activeFilm);
    }
  });
};

const renderPopup = (currentFilm) => {
  const popupElement = new PopupView(
      currentFilm,
      generateComments()
  ).getElement();
  pageMainElement.appendChild(popupElement);
  pageBodyElement.classList.add(`hide-overflow`);

  const popupCloseBtnElement = popupElement.querySelector(
      `.film-details__close-btn`
  );

  const onPopupCloseBtnClick = (evt) => {
    evt.preventDefault();
    pageMainElement.removeChild(popupElement);
    pageBodyElement.classList.remove(`hide-overflow`);
    popupCloseBtnElement.removeEventListener(`click`, onPopupCloseBtnClick);
    popupCloseBtnElement.removeEventListener(`keydown`, onPopupEscClick);
  };

  const onPopupEscClick = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      onPopupCloseBtnClick(evt);
    }
  };

  popupCloseBtnElement.addEventListener(`click`, onPopupCloseBtnClick);
  document.addEventListener(`keydown`, onPopupEscClick);
};

render(
    pageHeaderElement,
    RenderPosition.BEFOREEND,
    new UserProfileView().getElement()
);
render(
    pageMainElement,
    RenderPosition.BEFOREEND,
    new MenuView(filterData).getElement()
);

render(
    footerStatsElement,
    RenderPosition.BEFOREEND,
    new TotalMovieView(films.length).getElement()
);

// Тут сообщение об отсутствии фильмов
if (films.length === 0) {
  render(
      filmsListElement,
      RenderPosition.BEFOREEND,
      new NoFilmsMessageView().getElement()
  );
}
render(pageMainElement, RenderPosition.BEFOREEND, filmSectionElement);
render(filmSectionElement, RenderPosition.BEFOREEND, filmsListElement);

if (films.length !== 0) {
  render(
      filmsListElement,
      RenderPosition.AFTERBEGIN,
      new SortingView().getElement()
  );
  render(filmsListElement, RenderPosition.BEFOREEND, filmsListContainerElement);
  render(filmSectionElement, RenderPosition.BEFOREEND, topRatedListElement);
  render(
      filmSectionElement,
      RenderPosition.BEFOREEND,
      mostCommentedListElement
  );
  render(
      topRatedListElement,
      RenderPosition.BEFOREEND,
      topRatedContainerElement
  );
  render(
      mostCommentedListElement,
      RenderPosition.BEFOREEND,
      mostCommentedContainerElement
  );
}

films.slice(0, FILMS_COUNT).forEach((film) => {
  renderFilm(filmsListContainerElement, `AFTERBEGIN`, film);
});

addListenerToFilmsList(filmSectionElement, films);

topFilms.forEach((topFilm) => {
  renderFilm(topRatedContainerElement, `BEFOREEND`, topFilm);
});

commentedFilms.forEach((commentedFilm) => {
  renderFilm(mostCommentedContainerElement, `BEFOREEND`, commentedFilm);
});

if (films.length >= FILMS_COUNT) {
  let renderedFilmsCount = FILMS_COUNT;
  if (films.length !== 0) {
    render(filmsListElement, RenderPosition.BEFOREEND, showMoreFilmsBtnElement);
  }

  const onshowMoreFilmsBtnClick = (evt) => {
    evt.preventDefault();
    const addedCards = renderedFilmsCount;
    renderedFilmsCount += FILMS_COUNT;
    films
      .slice(addedCards, renderedFilmsCount)
      .forEach((film) =>
        renderFilm(filmsListContainerElement, `BEFOREEND`, film)
      );

    if (renderedFilmsCount >= MAX_FILMS_COUNT) {
      showMoreFilmsBtnElement.remove();
      showMoreFilmsBtnElement.removeEventListener(
          `click`,
          onshowMoreFilmsBtnClick
      );
    }
  };

  showMoreFilmsBtnElement.addEventListener(`click`, onshowMoreFilmsBtnClick);
}
